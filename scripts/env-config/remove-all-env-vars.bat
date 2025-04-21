@echo off
REM Script to remove all environment variables from a Vercel project

echo Removing all environment variables from Vercel project...

vercel env rm PROD_PHI_DB_NAME -y
vercel env rm PROD_PHI_DATABASE_URL -y
vercel env rm PROD_VPC_SECURITY_GROUP -y
vercel env rm PROD_MAIN_DB_AZ -y
vercel env rm PROD_PHI_DB_AZ -y
vercel env rm PROD_SUBNET_GROUP -y
vercel env rm PROD_NETWORK_TYPE -y
vercel env rm PROD_DB_INSTANCE_CLASS -y
vercel env rm AWS_REGION -y
vercel env rm SES_FROM_EMAIL -y
vercel env rm EMAIL_TEST_MODE -y
vercel env rm TEST_EMAIL -y
vercel env rm STRIPE_SECRET_KEY -y
vercel env rm STRIPE_WEBHOOK_SECRET -y
vercel env rm DB_HOST -y
vercel env rm DB_PORT -y
vercel env rm DB_NAME -y
vercel env rm DB_USER -y
vercel env rm DB_PASSWORD -y
vercel env rm DEV_MAIN_DATABASE_URL -y
vercel env rm PHI_DATABASE_URL -y
vercel env rm DEV_PHI_DATABASE_URL -y
vercel env rm API_BASE_URL -y
vercel env rm PROD_DB_USER -y
vercel env rm PROD_DB_PASSWORD -y
vercel env rm PROD_MAIN_DB_HOST -y
vercel env rm PROD_MAIN_DB_PORT -y
vercel env rm PROD_MAIN_DB_NAME -y
vercel env rm PROD_MAIN_DATABASE_URL -y
vercel env rm PROD_PHI_DB_HOST -y
vercel env rm PROD_PHI_DB_PORT -y
vercel env rm REDIS_CLOUD_PORT -y
vercel env rm REDIS_CLOUD_PASSWORD -y
vercel env rm NODE_ENV -y
vercel env rm ANTHROPIC_API_KEY -y
vercel env rm GROK_API_KEY -y
vercel env rm OPENAI_API_KEY -y
vercel env rm CLAUDE_MODEL_NAME -y
vercel env rm GROK_MODEL_NAME -y
vercel env rm GPT_MODEL_NAME -y
vercel env rm JWT_SECRET -y
vercel env rm JWT_TEST_TOKEN -y
vercel env rm LLM_MAX_TOKENS -y
vercel env rm LLM_TIMEOUT -y
vercel env rm AWS_ACCESS_KEY_ID -y
vercel env rm AWS_SECRET_ACCESS_KEY -y
vercel env rm REDIS_CLOUD_HOST -y

echo All environment variables have been removed.
echo Now you can add the essential variables using the add-essential-env-vars.bat script.

pause