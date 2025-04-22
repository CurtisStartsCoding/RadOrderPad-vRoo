/**
 * Setup Test Referring Organization
 * 
 * This script creates a test referring organization for testing the billing usage reporting functionality.
 */

const { program } = require('commander');
const { queryMainDb } = require('../../dist/config/db');
const stripeService = require('../../dist/services/billing/stripe/stripe.service').default;

// Parse command line arguments
program
  .option('--org-name <name>', 'Name for the test referring organization', 'Test Referring Practice')
  .option('--email <email>', 'Email for the test referring organization', 'test-referring@example.com');

program.parse(process.argv);
const options = program.opts();

// Main function
async function main() {
  try {
    console.log('=== Setting Up Test Referring Organization ===\n');
    
    // Check if a test referring organization already exists
    const existingOrgResult = await queryMainDb(`
      SELECT id, name, billing_id 
      FROM organizations 
      WHERE type = 'referring_practice' AND name = $1
    `, [options.orgName]);
    
    if (existingOrgResult.rows.length > 0) {
      const org = existingOrgResult.rows[0];
      
      console.log(`Test referring organization already exists: ID ${org.id}, Name: ${org.name}`);
      
      if (!org.billing_id) {
        // Organization exists but doesn't have a billing ID
        console.log(`Adding Stripe billing ID...`);
        
        // Create a Stripe customer
        const customer = await stripeService.createCustomer(
          options.orgName,
          options.email,
          { organization_id: org.id.toString(), organization_type: 'referring_practice' }
        );
        
        // Update the organization with the Stripe customer ID
        await queryMainDb(`
          UPDATE organizations 
          SET billing_id = $1 
          WHERE id = $2
        `, [customer.id, org.id]);
        
        console.log(`Added Stripe customer ID ${customer.id} to organization ${org.id}`);
      }
      
      return;
    }
    
    // Create a new referring organization
    console.log(`Creating new test referring organization: ${options.orgName}`);
    
    const orgResult = await queryMainDb(`
      INSERT INTO organizations (
        name, 
        type, 
        status, 
        credit_balance,
        subscription_tier
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING id
    `, [
      options.orgName,
      'referring_practice',
      'active',
      1000, // Give them plenty of credits
      'tier_1'
    ]);
    
    const orgId = orgResult.rows[0].id;
    
    // Create a Stripe customer
    const customer = await stripeService.createCustomer(
      options.orgName,
      options.email,
      { organization_id: orgId.toString(), organization_type: 'referring_practice' }
    );
    
    // Update the organization with the Stripe customer ID
    await queryMainDb(`
      UPDATE organizations 
      SET billing_id = $1 
      WHERE id = $2
    `, [customer.id, orgId]);
    
    console.log(`Created test referring organization with ID: ${orgId}`);
    console.log(`Added Stripe customer ID: ${customer.id}`);
    
    // Create a test admin user for the organization
    const adminResult = await queryMainDb(`
      INSERT INTO users (
        organization_id,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        is_active,
        email_verified
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING id
    `, [
      orgId,
      `admin-${orgId}@${options.email.split('@')[1]}`,
      'placeholder_hash', // In a real system, this would be properly hashed
      'Test',
      'Admin',
      'admin_referring',
      true,
      true
    ]);
    
    const adminId = adminResult.rows[0].id;
    console.log(`Created test admin user with ID: ${adminId}`);
    
    // Create a test physician user for the organization
    const physicianResult = await queryMainDb(`
      INSERT INTO users (
        organization_id,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        is_active,
        email_verified
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING id
    `, [
      orgId,
      `physician-${orgId}@${options.email.split('@')[1]}`,
      'placeholder_hash', // In a real system, this would be properly hashed
      'Test',
      'Physician',
      'physician',
      true,
      true
    ]);
    
    const physicianId = physicianResult.rows[0].id;
    console.log(`Created test physician user with ID: ${physicianId}`);
    
    console.log('\nTest referring organization setup complete!');
    console.log('\nYou can now run the billing usage reporting test with:');
    console.log('scripts\\billing\\test-billing-usage-reporting.bat --insert-test-data');
  } catch (error) {
    console.error('Error setting up test referring organization:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);