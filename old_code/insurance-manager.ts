import { queryPhiDb } from '../../../config/db';
import { InsuranceUpdateData } from './types';

/**
 * Update insurance information
 * @param patientId Patient ID
 * @param insuranceData Insurance data
 * @returns Promise with insurance ID
 */
export async function updateInsuranceInfo(
  patientId: number,
  insuranceData: InsuranceUpdateData
): Promise<number> {
  // Check if insurance record already exists
  const isPrimary = insuranceData.isPrimary === false ? false : true;
  
  const insuranceResult = await queryPhiDb(
    `SELECT id FROM patient_insurance WHERE patient_id = $1 AND is_primary = $2`,
    [patientId, isPrimary]
  );
  
  let insuranceId;
  
  if (insuranceResult.rows.length > 0) {
    // Update existing insurance record
    insuranceId = insuranceResult.rows[0].id;
    
    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;
    
    // Map insuranceData fields to database columns
    const fieldMap: { [key: string]: string } = {
      insurerName: 'insurer_name',
      policyNumber: 'policy_number',
      groupNumber: 'group_number',
      planType: 'plan_type',
      policyHolderName: 'policy_holder_name',
      policyHolderRelationship: 'policy_holder_relationship',
      policyHolderDateOfBirth: 'policy_holder_date_of_birth',
      verificationStatus: 'verification_status'
    };
    
    // Build update query dynamically based on provided fields
    for (const [key, value] of Object.entries(insuranceData)) {
      if (fieldMap[key] && value !== undefined) {
        updateFields.push(`${fieldMap[key]} = $${valueIndex}`);
        updateValues.push(value);
        valueIndex++;
      }
    }
    
    if (updateFields.length === 0) {
      throw new Error('No valid insurance fields provided for update');
    }
    
    // Add updated_at field
    updateFields.push(`updated_at = NOW()`);
    
    const updateQuery = `
      UPDATE patient_insurance
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING id
    `;
    
    const result = await queryPhiDb(updateQuery, [...updateValues, insuranceId]);
    insuranceId = result.rows[0].id;
  } else {
    // Create new insurance record
    if (!insuranceData.insurerName || !insuranceData.policyNumber) {
      throw new Error('Insurer name and policy number are required for new insurance records');
    }
    
    const result = await queryPhiDb(
      `INSERT INTO patient_insurance
       (patient_id, is_primary, insurer_name, policy_number, group_number, 
        plan_type, policy_holder_name, policy_holder_relationship, 
        policy_holder_date_of_birth, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        patientId,
        isPrimary,
        insuranceData.insurerName,
        insuranceData.policyNumber,
        insuranceData.groupNumber || null,
        insuranceData.planType || null,
        insuranceData.policyHolderName || null,
        insuranceData.policyHolderRelationship || null,
        insuranceData.policyHolderDateOfBirth || null,
        insuranceData.verificationStatus || 'not_verified'
      ]
    );
    
    insuranceId = result.rows[0].id;
  }
  
  return insuranceId;
}

/**
 * Update insurance information from parsed EMR data
 * @param patientId Patient ID
 * @param parsedInsuranceInfo Parsed insurance information
 * @returns Promise with result
 */
export async function updateInsuranceFromEmr(
  patientId: number,
  parsedInsuranceInfo: any
): Promise<void> {
  if (!parsedInsuranceInfo || Object.keys(parsedInsuranceInfo).length === 0) {
    return;
  }
  
  // Check if insurance record already exists
  const insuranceResult = await queryPhiDb(
    `SELECT id FROM patient_insurance WHERE patient_id = $1 AND is_primary = true`,
    [patientId]
  );
  
  if (insuranceResult.rows.length > 0) {
    // Update existing insurance record
    const insuranceId = insuranceResult.rows[0].id;
    const insuranceUpdateFields = [];
    const insuranceUpdateValues = [];
    let valueIndex = 1;
    
    if (parsedInsuranceInfo.insurerName) {
      insuranceUpdateFields.push(`insurer_name = $${valueIndex}`);
      insuranceUpdateValues.push(parsedInsuranceInfo.insurerName);
      valueIndex++;
    }
    
    if (parsedInsuranceInfo.policyNumber) {
      insuranceUpdateFields.push(`policy_number = $${valueIndex}`);
      insuranceUpdateValues.push(parsedInsuranceInfo.policyNumber);
      valueIndex++;
    }
    
    if (parsedInsuranceInfo.groupNumber) {
      insuranceUpdateFields.push(`group_number = $${valueIndex}`);
      insuranceUpdateValues.push(parsedInsuranceInfo.groupNumber);
      valueIndex++;
    }
    
    if (parsedInsuranceInfo.policyHolderName) {
      insuranceUpdateFields.push(`policy_holder_name = $${valueIndex}`);
      insuranceUpdateValues.push(parsedInsuranceInfo.policyHolderName);
      valueIndex++;
    }
    
    if (insuranceUpdateFields.length > 0) {
      const insuranceUpdateQuery = `
        UPDATE patient_insurance
        SET ${insuranceUpdateFields.join(', ')}, updated_at = NOW()
        WHERE id = $${valueIndex}
      `;
      
      await queryPhiDb(insuranceUpdateQuery, [...insuranceUpdateValues, insuranceId]);
    }
  } else if (parsedInsuranceInfo.insurerName && parsedInsuranceInfo.policyNumber) {
    // Create new insurance record
    await queryPhiDb(
      `INSERT INTO patient_insurance
       (patient_id, is_primary, insurer_name, policy_number, group_number, policy_holder_name)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        patientId,
        true,
        parsedInsuranceInfo.insurerName,
        parsedInsuranceInfo.policyNumber,
        parsedInsuranceInfo.groupNumber || null,
        parsedInsuranceInfo.policyHolderName || null
      ]
    );
  }
}

export default {
  updateInsuranceInfo,
  updateInsuranceFromEmr
};