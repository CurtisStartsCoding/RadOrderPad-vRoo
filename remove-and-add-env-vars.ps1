# PowerShell script to remove all environment variables and add back only the essential ones

Write-Host "Removing all environment variables from Vercel project..." -ForegroundColor Green

# List of all environment variables to remove
$envVarsToRemove = @(
    "PROD_PHI_DATABASE_URL",
    "PROD_VPC_SECURITY_GROUP",
    "PROD_MAIN_DB_AZ",
    "PROD_PHI_DB_AZ",
    "PROD_SUBNET_GROUP",
    "PROD_NETWORK_TYPE",
    "PROD_DB_INSTANCE_CLASS",
    "AWS_REGION",
    "SES_FROM_EMAIL",
    "EMAIL_TEST_MODE",
    "TEST_EMAIL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "DEV_MAIN_DATABASE_URL",
    "PHI_DATABASE_URL",
    "DEV_PHI_DATABASE_URL",
    "API_BASE_URL",
    "PROD_DB_USER",
    "PROD_DB_PASSWORD",
    "PROD_MAIN_DB_HOST",
    "PROD_MAIN_DB_PORT",
    "PROD_MAIN_DB_NAME",
    "PROD_MAIN_DATABASE_URL",
    "PROD_PHI_DB_HOST",
    "PROD_PHI_DB_PORT",
    "REDIS_CLOUD_PORT",
    "REDIS_CLOUD_PASSWORD",
    "NODE_ENV",
    "ANTHROPIC_API_KEY",
    "GROK_API_KEY",
    "OPENAI_API_KEY",
    "CLAUDE_MODEL_NAME",
    "GROK_MODEL_NAME",
    "GPT_MODEL_NAME",
    "JWT_SECRET",
    "JWT_TEST_TOKEN",
    "LLM_MAX_TOKENS",
    "LLM_TIMEOUT",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "REDIS_CLOUD_HOST"
)

# Remove each environment variable
foreach ($envVar in $envVarsToRemove) {
    Write-Host "Removing $envVar..." -ForegroundColor Yellow
    vercel env rm $envVar -y
}

Write-Host "All environment variables have been removed." -ForegroundColor Green
Write-Host "Now adding essential environment variables..." -ForegroundColor Green

# Add essential environment variables
Write-Host "Adding NODE_ENV..." -ForegroundColor Yellow
vercel env add NODE_ENV production

Write-Host "Adding MAIN_DATABASE_URL..." -ForegroundColor Yellow
vercel env add MAIN_DATABASE_URL "postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=require"

Write-Host "Adding PHI_DATABASE_URL..." -ForegroundColor Yellow
vercel env add PHI_DATABASE_URL "postgresql://postgres:SimplePassword123@radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=require"

Write-Host "Adding REDIS_CLOUD_HOST..." -ForegroundColor Yellow
vercel env add REDIS_CLOUD_HOST "redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com"

Write-Host "Adding REDIS_CLOUD_PORT..." -ForegroundColor Yellow
vercel env add REDIS_CLOUD_PORT "11584"

Write-Host "Adding REDIS_CLOUD_PASSWORD..." -ForegroundColor Yellow
vercel env add REDIS_CLOUD_PASSWORD "zHUbspGPcewJsoT9G9TSQncuSl0v0MUH"

Write-Host "Adding ANTHROPIC_API_KEY..." -ForegroundColor Yellow
vercel env add ANTHROPIC_API_KEY "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"

Write-Host "Adding JWT_SECRET..." -ForegroundColor Yellow
vercel env add JWT_SECRET "radorderpad-jwt-secret-for-development-and-testing-purposes-only"

Write-Host "Adding AWS_ACCESS_KEY_ID..." -ForegroundColor Yellow
vercel env add AWS_ACCESS_KEY_ID "AKIAVP2W2JHIZLEMD37D"

Write-Host "Adding AWS_SECRET_ACCESS_KEY..." -ForegroundColor Yellow
vercel env add AWS_SECRET_ACCESS_KEY "09AqJY+JKfTHT3gyS2uSmArQbWiKppxRmsJ640sk"

Write-Host "Adding AWS_REGION..." -ForegroundColor Yellow
vercel env add AWS_REGION "us-east-2"

Write-Host "Adding STRIPE_SECRET_KEY..." -ForegroundColor Yellow
vercel env add STRIPE_SECRET_KEY "sk_test_51RDXHbRlYCYG6MN4qVmMjYk4Szm1HbhCq1JxnjJ7Gfc00vIWVvVVe4VpLjiKb45647tEZLozDD0Bpif4gjE1e9wG00sjeHGb24"

Write-Host "Adding STRIPE_WEBHOOK_SECRET..." -ForegroundColor Yellow
vercel env add STRIPE_WEBHOOK_SECRET "whsec_51c59e7472f3ee8c140dfb98b9967f76cf78aad097f1a1971a515b02cbda8990"

Write-Host "All essential environment variables have been added." -ForegroundColor Green
Write-Host "Now you can redeploy your application." -ForegroundColor Green

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")