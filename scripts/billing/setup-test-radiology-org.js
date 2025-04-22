/**
 * Setup Test Radiology Organization
 * 
 * This script creates a test radiology organization with a valid Stripe customer ID
 * for testing the billing usage reporting functionality.
 */

const { program } = require('commander');
const { queryMainDb } = require('../../dist/config/db');
const stripeService = require('../../dist/services/billing/stripe/stripe.service').default;

// Parse command line arguments
program
  .option('--org-name <name>', 'Name for the test radiology organization', 'Test Radiology Group')
  .option('--email <email>', 'Email for the test radiology organization', 'test-radiology@example.com');

program.parse(process.argv);
const options = program.opts();

// Main function
async function main() {
  try {
    console.log('=== Setting Up Test Radiology Organization ===\n');
    
    // Check if a test radiology organization already exists
    const existingOrgResult = await queryMainDb(`
      SELECT id, name, billing_id 
      FROM organizations 
      WHERE type = 'radiology_group' AND name = $1
    `, [options.orgName]);
    
    if (existingOrgResult.rows.length > 0) {
      const org = existingOrgResult.rows[0];
      
      if (org.billing_id) {
        console.log(`Test radiology organization already exists with Stripe billing ID: ${org.billing_id}`);
        console.log(`Organization ID: ${org.id}, Name: ${org.name}`);
        return;
      }
      
      // Organization exists but doesn't have a billing ID
      console.log(`Test radiology organization exists but doesn't have a Stripe billing ID. Adding one now...`);
      
      // Create a Stripe customer
      const customer = await stripeService.createCustomer(
        options.orgName,
        options.email,
        { organization_id: org.id.toString(), organization_type: 'radiology_group' }
      );
      
      // Update the organization with the Stripe customer ID
      await queryMainDb(`
        UPDATE organizations 
        SET billing_id = $1 
        WHERE id = $2
      `, [customer.id, org.id]);
      
      console.log(`Added Stripe customer ID ${customer.id} to organization ${org.id}`);
      return;
    }
    
    // Create a new radiology organization
    console.log(`Creating new test radiology organization: ${options.orgName}`);
    
    const orgResult = await queryMainDb(`
      INSERT INTO organizations (
        name, 
        type, 
        status, 
        credit_balance
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING id
    `, [
      options.orgName,
      'radiology_group',
      'active',
      0 // Radiology groups don't use credits
    ]);
    
    const orgId = orgResult.rows[0].id;
    
    // Create a Stripe customer
    const customer = await stripeService.createCustomer(
      options.orgName,
      options.email,
      { organization_id: orgId.toString(), organization_type: 'radiology_group' }
    );
    
    // Update the organization with the Stripe customer ID
    await queryMainDb(`
      UPDATE organizations 
      SET billing_id = $1 
      WHERE id = $2
    `, [customer.id, orgId]);
    
    console.log(`Created test radiology organization with ID: ${orgId}`);
    console.log(`Added Stripe customer ID: ${customer.id}`);
    
    // Create a test admin user for the organization
    const userResult = await queryMainDb(`
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
      'admin_radiology',
      true,
      true
    ]);
    
    const userId = userResult.rows[0].id;
    console.log(`Created test admin user with ID: ${userId}`);
    
    console.log('\nTest radiology organization setup complete!');
    console.log('\nYou can now run the billing usage reporting test with:');
    console.log('scripts\\billing\\test-billing-usage-reporting.bat --insert-test-data');
  } catch (error) {
    console.error('Error setting up test radiology organization:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);