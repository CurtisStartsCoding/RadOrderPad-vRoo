import logger from '../../utils/logger';

interface NPIRegistryResponse {
  result_count: number;
  results: Array<{
    created_epoch: number;
    enumeration_type: string;
    last_updated_epoch: number;
    number: string;
    addresses: Array<{
      address_1: string;
      address_2?: string;
      address_purpose: string;
      address_type: string;
      city: string;
      country_code: string;
      country_name: string;
      postal_code: string;
      state: string;
      telephone_number?: string;
      fax_number?: string;
    }>;
    basic: {
      authorized_official_credential?: string;
      authorized_official_first_name?: string;
      authorized_official_last_name?: string;
      authorized_official_middle_name?: string;
      authorized_official_name_prefix?: string;
      authorized_official_name_suffix?: string;
      authorized_official_telephone_number?: string;
      authorized_official_title_or_position?: string;
      credential?: string;
      enumeration_date: string;
      first_name?: string;
      gender?: string;
      last_name?: string;
      last_updated: string;
      middle_name?: string;
      name?: string;
      name_prefix?: string;
      name_suffix?: string;
      organizational_subpart?: string;
      parent_organization_legal_business_name?: string;
      parent_organization_tin?: string;
      sole_proprietor?: string;
      status: string;
    };
    identifiers?: Array<{
      code: string;
      desc: string;
      identifier: string;
      issuer: string;
      state: string;
    }>;
    other_names?: Array<{
      code: string;
      credential?: string;
      first_name?: string;
      last_name?: string;
      middle_name?: string;
      name_prefix?: string;
      name_suffix?: string;
      organization_name?: string;
      type: string;
    }>;
    taxonomies?: Array<{
      code: string;
      desc: string;
      license?: string;
      primary: boolean;
      state?: string;
      taxonomy_group?: string;
    }>;
  }>;
}

/**
 * Lookup NPI information from the CMS NPI Registry
 * @param npiNumber - 10-digit NPI number
 * @returns Formatted physician information or null if not found
 */
interface FormattedNPIData {
  number: string;
  basic: {
    firstName: string;
    lastName: string;
    middleName: string;
    namePrefix: string;
    nameSuffix: string;
    credential: string;
    gender: string;
    status: string;
    soleProprietor: string;
    organizationName: string;
    enumerationDate: string;
    lastUpdated: string;
  };
  addresses: Array<{
    addressPurpose: string;
    addressType: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
    telephoneNumber: string;
    faxNumber: string;
  }>;
  taxonomies: Array<{
    code: string;
    description: string;
    primary: boolean;
    state: string;
    license: string;
  }>;
  primaryTaxonomy: string;
}

export async function lookupNPI(npiNumber: string): Promise<{
  success: boolean;
  data?: FormattedNPIData;
  error?: string;
}> {
  try {
    // Validate NPI format
    if (!npiNumber || !/^\d{10}$/.test(npiNumber)) {
      return {
        success: false,
        error: 'Invalid NPI number. Must be exactly 10 digits.'
      };
    }

    // Call NPI Registry API
    const apiUrl = `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${npiNumber}`;
    logger.info('Looking up NPI', { npiNumber });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      logger.error('NPI Registry API error', { 
        status: response.status, 
        statusText: response.statusText 
      });
      return {
        success: false,
        error: `NPI Registry API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json() as NPIRegistryResponse;

    // Check if NPI was found
    if (!data.results || data.result_count === 0) {
      return {
        success: false,
        error: 'NPI number not found in registry'
      };
    }

    // Extract the first result
    const npiData = data.results[0];

    // Format the response
    const formattedData = {
      number: npiData.number,
      basic: {
        firstName: npiData.basic.first_name || '',
        lastName: npiData.basic.last_name || '',
        middleName: npiData.basic.middle_name || '',
        namePrefix: npiData.basic.name_prefix || '',
        nameSuffix: npiData.basic.name_suffix || '',
        credential: npiData.basic.credential || '',
        gender: npiData.basic.gender || '',
        status: npiData.basic.status,
        soleProprietor: npiData.basic.sole_proprietor || '',
        organizationName: npiData.basic.name || '',
        enumerationDate: npiData.basic.enumeration_date,
        lastUpdated: npiData.basic.last_updated
      },
      addresses: npiData.addresses.map(addr => ({
        addressPurpose: addr.address_purpose,
        addressType: addr.address_type,
        address1: addr.address_1,
        address2: addr.address_2 || '',
        city: addr.city,
        state: addr.state,
        postalCode: addr.postal_code,
        countryCode: addr.country_code,
        telephoneNumber: addr.telephone_number || '',
        faxNumber: addr.fax_number || ''
      })),
      taxonomies: npiData.taxonomies?.map(tax => ({
        code: tax.code,
        description: tax.desc,
        primary: tax.primary,
        state: tax.state || '',
        license: tax.license || ''
      })) || [],
      // Include the primary taxonomy (specialty) separately for easy access
      primaryTaxonomy: npiData.taxonomies?.find(t => t.primary)?.desc || ''
    };

    logger.info('NPI lookup successful', { 
      npiNumber, 
      name: `${formattedData.basic.firstName} ${formattedData.basic.lastName}` 
    });

    return {
      success: true,
      data: formattedData
    };

  } catch (error) {
    logger.error('Error looking up NPI', { error, npiNumber });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to lookup NPI'
    };
  }
}

export default { lookupNPI };