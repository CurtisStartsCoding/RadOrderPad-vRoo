/**
 * Script to create test organizations and users for troubleshooting location permissions
 * This creates a controlled test environment with multiple organizations and connections
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'tokens');

// Super admin credentials
const SUPER_ADMIN = {
  email: 'superadmin.20141244@example.com',
  password: 'password123'
};

// Test organizations to create
const TEST_ORGS = [
  {
    name: 'Test Referring Clinic A',
    type: 'referring_physician',
    npi: '1234567890',
    address: '123 Test St',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    phone: '312-555-0100',
    contactEmail: 'clinic-a@test.com'
  },
  {
    name: 'Test Referring Clinic B', 
    type: 'referring_physician',
    npi: '0987654321',
    address: '456 Demo Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60602',
    phone: '312-555-0200',
    contactEmail: 'clinic-b@test.com'
  },
  {
    name: 'Test Radiology Center X',
    type: 'radiology',
    npi: '1122334455',
    address: '789 Imaging Blvd',
    city: 'Chicago',
    state: 'IL',
    zip: '60603',
    phone: '312-555-0300',
    contactEmail: 'radiology-x@test.com'
  },
  {
    name: 'Test Radiology Center Y',
    type: 'radiology', 
    npi: '5544332211',
    address: '321 Scan Dr',
    city: 'Chicago',
    state: 'IL',
    zip: '60604',
    phone: '312-555-0400',
    contactEmail: 'radiology-y@test.com'
  }
];

// Test users to create for each organization
const TEST_USERS = [
  // Referring Clinic A users
  {
    email: 'admin.clinica@test.com',
    password: 'TestPass123!',
    role: 'admin_referring',
    orgIndex: 0
  },
  {
    email: 'staff.clinica@test.com',
    password: 'TestPass123!',
    role: 'admin_staff',
    orgIndex: 0
  },
  {
    email: 'doc.clinica@test.com',
    password: 'TestPass123!',
    role: 'physician',
    orgIndex: 0
  },
  // Referring Clinic B users
  {
    email: 'admin.clinicb@test.com',
    password: 'TestPass123!',
    role: 'admin_referring',
    orgIndex: 1
  },
  {
    email: 'staff.clinicb@test.com',
    password: 'TestPass123!',
    role: 'admin_staff',
    orgIndex: 1
  },
  // Radiology Center X users
  {
    email: 'admin.radx@test.com',
    password: 'TestPass123!',
    role: 'admin_radiology',
    orgIndex: 2
  },
  {
    email: 'scheduler.radx@test.com',
    password: 'TestPass123!',
    role: 'scheduler',
    orgIndex: 2
  },
  // Radiology Center Y users
  {
    email: 'admin.rady@test.com',
    password: 'TestPass123!',
    role: 'admin_radiology',
    orgIndex: 3
  }
];

let superAdminToken = null;
let createdOrgs = [];

// Helper function to login
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    return response.data.token;
  } catch (error) {
    console.error(`Failed to login with ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Create organization
async function createOrganization(org) {
  console.log(`\n📦 Creating organization: ${org.name}`);
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      organization: {
        name: org.name,
        type: org.type === 'referring_physician' ? 'referring_practice' : 'radiology_group',
        npi: org.npi,
        tax_id: '12-3456789',
        address_line1: org.address,
        city: org.city,
        state: org.state,
        zip_code: org.zip,
        phone_number: org.phone,
        contact_email: org.contactEmail
      },
      user: {
        email: `temp.${Date.now()}@test.com`,
        password: 'TempPass123!',
        first_name: 'Temp',
        last_name: 'Admin'
      },
      captchaToken: 'test-token-for-development'
    }, {
      headers: {
        'X-Test-Mode': 'true'
      }
    });

    console.log(`✅ Organization created: ${org.name}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`⚠️  Organization already exists: ${org.name}`);
      // Try to get the org ID by searching
      return await findOrganization(org.name);
    }
    throw error;
  }
}

// Find organization by name
async function findOrganization(name) {
  try {
    const response = await axios.get(`${API_URL}/api/superadmin/organizations`, {
      headers: {
        'Authorization': `Bearer ${superAdminToken}`
      }
    });
    
    const org = response.data.organizations.find(o => o.name === name);
    if (org) {
      console.log(`📍 Found existing organization: ${name} (ID: ${org.id})`);
      return { organization: { id: org.id } };
    }
    
    throw new Error(`Organization not found: ${name}`);
  } catch (error) {
    console.error(`Failed to find organization ${name}:`, error.message);
    throw error;
  }
}

// Create user via super admin
async function createUserViaSuperAdmin(user, orgId) {
  console.log(`\n👤 Creating user: ${user.email} with role ${user.role}`);
  
  try {
    // First check if user exists
    const checkResponse = await axios.get(`${API_URL}/api/superadmin/users`, {
      headers: {
        'Authorization': `Bearer ${superAdminToken}`
      },
      params: {
        email: user.email
      }
    });

    if (checkResponse.data.users && checkResponse.data.users.length > 0) {
      console.log(`⚠️  User already exists: ${user.email}`);
      return checkResponse.data.users[0];
    }
  } catch (error) {
    // User doesn't exist, continue to create
  }

  try {
    const response = await axios.post(`${API_URL}/api/superadmin/users`, {
      email: user.email,
      password: user.password,
      firstName: user.email.split('.')[0],
      lastName: user.role,
      role: user.role,
      organizationId: orgId
    }, {
      headers: {
        'Authorization': `Bearer ${superAdminToken}`
      }
    });

    console.log(`✅ User created: ${user.email}`);
    return response.data.user;
  } catch (error) {
    console.error(`❌ Failed to create user ${user.email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Create connection between organizations
async function createConnection(fromOrgId, toOrgId, adminToken) {
  console.log(`\n🔗 Creating connection from org ${fromOrgId} to org ${toOrgId}`);
  
  try {
    // Request connection
    const response = await axios.post(`${API_URL}/api/connections`, {
      targetOrgId: toOrgId,
      notes: 'Test connection for permissions testing'
    }, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log(`✅ Connection request created`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`⚠️  Connection already exists`);
      return { existing: true };
    }
    console.error(`❌ Failed to create connection:`, error.response?.data || error.message);
    throw error;
  }
}

// Approve connection via super admin
async function approveConnection(connectionId) {
  console.log(`\n✅ Approving connection ${connectionId}`);
  
  try {
    const response = await axios.post(`${API_URL}/api/superadmin/connections/${connectionId}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${superAdminToken}`
      }
    });
    
    console.log(`✅ Connection approved`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to approve connection:`, error.response?.data || error.message);
    // Continue even if approval fails - connection might already be active
  }
}

// Create locations for an organization
async function createLocations(orgId, adminToken, orgName) {
  console.log(`\n📍 Creating locations for ${orgName}`);
  
  const locations = [
    {
      name: `${orgName} - Main Location`,
      address: '100 Main St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      phone: '312-555-1000'
    },
    {
      name: `${orgName} - North Branch`,
      address: '200 North Ave',
      city: 'Evanston',
      state: 'IL', 
      zip: '60201',
      phone: '847-555-2000'
    }
  ];

  for (const location of locations) {
    try {
      await axios.post(`${API_URL}/api/organizations/mine/locations`, {
        name: location.name,
        address_line1: location.address,
        city: location.city,
        state: location.state,
        zip_code: location.zip,
        phone_number: location.phone
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log(`✅ Created location: ${location.name}`);
    } catch (error) {
      console.error(`❌ Failed to create location ${location.name}:`, error.response?.data || error.message);
    }
  }
}

// Main setup function
async function setupTestEnvironment() {
  console.log('=== SETTING UP TEST ENVIRONMENT FOR PERMISSIONS TESTING ===\n');

  try {
    // Step 1: Login as super admin
    console.log('🔐 Logging in as super admin...');
    superAdminToken = await login(SUPER_ADMIN.email, SUPER_ADMIN.password);
    console.log('✅ Super admin logged in');

    // Step 2: Create organizations
    console.log('\n=== CREATING ORGANIZATIONS ===');
    for (const org of TEST_ORGS) {
      const result = await createOrganization(org);
      createdOrgs.push({
        ...org,
        id: result.organization?.id || result.id
      });
    }

    // Step 3: Create users
    console.log('\n=== CREATING USERS ===');
    const createdUsers = [];
    for (const user of TEST_USERS) {
      const orgId = createdOrgs[user.orgIndex].id;
      const createdUser = await createUserViaSuperAdmin(user, orgId);
      createdUsers.push({
        ...user,
        id: createdUser.id,
        orgId: orgId
      });
    }

    // Step 4: Create locations for each organization
    console.log('\n=== CREATING LOCATIONS ===');
    for (let i = 0; i < createdOrgs.length; i++) {
      const adminUser = createdUsers.find(u => u.orgIndex === i && u.role.includes('admin'));
      if (adminUser) {
        const adminToken = await login(adminUser.email, adminUser.password);
        await createLocations(createdOrgs[i].id, adminToken, createdOrgs[i].name);
      }
    }

    // Step 5: Create connections
    console.log('\n=== CREATING CONNECTIONS ===');
    // Connect Clinic A to both radiology centers
    const clinicAAdmin = await login('admin.clinica@test.com', 'TestPass123!');
    await createConnection(createdOrgs[0].id, createdOrgs[2].id, clinicAAdmin); // A -> X
    await createConnection(createdOrgs[0].id, createdOrgs[3].id, clinicAAdmin); // A -> Y
    
    // Connect Clinic B to Radiology X only
    const clinicBAdmin = await login('admin.clinicb@test.com', 'TestPass123!');
    await createConnection(createdOrgs[1].id, createdOrgs[2].id, clinicBAdmin); // B -> X

    // Note: In real environment, the radiology admin would need to approve these connections

    // Step 6: Generate tokens for all users
    console.log('\n=== GENERATING TOKENS ===');
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const tokenSummary = [];
    for (const user of createdUsers) {
      try {
        const token = await login(user.email, user.password);
        const filename = `test-${user.email.replace('@', '-').replace('.', '-')}-token.txt`;
        fs.writeFileSync(path.join(OUTPUT_DIR, filename), token);
        tokenSummary.push({
          email: user.email,
          role: user.role,
          org: createdOrgs[user.orgIndex].name,
          tokenFile: filename
        });
        console.log(`✅ Token saved for ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to generate token for ${user.email}`);
      }
    }

    // Save summary
    const summaryData = {
      organizations: createdOrgs,
      users: createdUsers,
      tokens: tokenSummary,
      connections: [
        { from: 'Test Referring Clinic A', to: 'Test Radiology Center X', status: 'pending' },
        { from: 'Test Referring Clinic A', to: 'Test Radiology Center Y', status: 'pending' },
        { from: 'Test Referring Clinic B', to: 'Test Radiology Center X', status: 'pending' }
      ]
    };

    fs.writeFileSync(
      path.join(__dirname, 'test-environment-summary.json'),
      JSON.stringify(summaryData, null, 2)
    );

    console.log('\n=== SETUP COMPLETE ===');
    console.log('\nTest Environment Summary:');
    console.log(`- Created ${createdOrgs.length} organizations`);
    console.log(`- Created ${createdUsers.length} users`);
    console.log(`- Created 3 connection requests (need approval)`);
    console.log(`\nSummary saved to: test-environment-summary.json`);
    console.log(`Tokens saved to: ${OUTPUT_DIR}`);

    console.log('\n⚠️  IMPORTANT: Connection requests need to be approved by radiology admins!');
    console.log('Run the test-location-permissions.js script after approving connections.');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the setup
setupTestEnvironment();