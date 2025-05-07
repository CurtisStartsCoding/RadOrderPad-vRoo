# AWS Security Group Update Instructions

## Your Current IP Address
Your current public IP address is: **69.138.136.57**

## Step-by-Step Instructions to Update AWS Security Group

1. **Log in to the AWS Management Console**
   - Go to https://aws.amazon.com/console/
   - Sign in with your AWS account credentials

2. **Navigate to EC2 Security Groups**
   - Click on "Services" in the top menu
   - Under "Compute", select "EC2"
   - In the left sidebar, under "Network & Security", click on "Security Groups"

3. **Find the RDS Security Group**
   - Look for the security group with the following details:
     - Name: `radorderpad-rds-sg`
     - Group ID: `sg-0a56114b12da9df6a`

4. **Edit Inbound Rules**
   - Select the security group
   - Click on the "Inbound rules" tab at the bottom
   - Click the "Edit inbound rules" button

5. **Add a New Rule**
   - Click "Add rule"
   - Configure the new rule with these settings:
     - Type: PostgreSQL
     - Protocol: TCP
     - Port range: 5432
     - Source: Custom
     - CIDR: `69.138.136.57/32` (your IP address with /32 suffix)
     - Description: "My development machine"
   - Click "Save rules"

6. **Verify the Connection**
   - After updating the security group, run the test connection script:
     ```
     node db-migrations/test-connection.js --db="postgresql://postgres:postgres123@radorder-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main"
     ```
   - If successful, you should see database information and permissions

7. **Run the Migration**
   - Once the connection is verified, run the migration script:
     ```
     node db-migrations/aws-postgres-migration.js --use-env
     ```
   - This will migrate both the main and PHI databases

## Important Notes

- The `/32` suffix in the CIDR notation means the rule applies only to your specific IP address
- If your IP address changes (e.g., if you connect from a different network), you'll need to update this rule
- For security reasons, avoid using overly permissive rules like `0.0.0.0/0` (allows all IPs)
- Remember to remove or update this rule after your demo if needed

## Troubleshooting

If you still can't connect after updating the security group:

1. **Check VPC Configuration**
   - Ensure the RDS instances are in the VPC you expect
   - Verify subnet configurations

2. **Check Network ACLs**
   - Network ACLs might be blocking the connection even if the security group allows it

3. **Wait for Changes to Propagate**
   - AWS security group changes can sometimes take a few minutes to fully propagate