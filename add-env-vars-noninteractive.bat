@echo off
REM Script to add essential environment variables to Vercel without interactive prompts

echo Adding essential environment variables to Vercel...

echo Adding NODE_ENV...
vercel env add NODE_ENV production --scope=production,preview,development -y

echo Adding MAIN_DATABASE_URL...
vercel env add MAIN_DATABASE_URL "postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=require" --scope=production,preview,development -y

echo Adding PHI_DATABASE_URL...
vercel env add PHI_DATABASE_URL "postgresql://postgres:SimplePassword123@radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=require" --scope=production,preview,development -y

echo Adding REDIS_CLOUD_HOST...
vercel env add REDIS_CLOUD_HOST "redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com" --scope=production,preview,development -y

echo Adding REDIS_CLOUD_PORT...
vercel env add REDIS_CLOUD_PORT "11584" --scope=production,preview,development -y

echo Adding REDIS_CLOUD_PASSWORD...
vercel env add REDIS_CLOUD_PASSWORD "zHUbspGPcewJsoT9G9TSQncuSl0v0MUH" --scope=production,preview,development -y

echo Adding ANTHROPIC_API_KEY...
vercel env add ANTHROPIC_API_KEY "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" --scope=production,preview,development -y

echo Adding JWT_SECRET...
vercel env add JWT_SECRET "radorderpad-jwt-secret-for-development-and-testing-purposes-only" --scope=production,preview,development -y

echo Adding AWS_ACCESS_KEY_ID...
vercel env add AWS_ACCESS_KEY_ID "AKIAVP2W2JHIZLEMD37D" --scope=production,preview,development -y

echo Adding AWS_SECRET_ACCESS_KEY...
vercel env add AWS_SECRET_ACCESS_KEY "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" --scope=production,preview,development -y

echo Adding AWS_REGION...
vercel env add AWS_REGION "us-east-2" --scope=production,preview,development -y

echo Adding STRIPE_SECRET_KEY...
vercel env add STRIPE_SECRET_KEY "sk_test_51RDXHbRlYCYG6MN4qVmMjYk4Szm1HbhCq1JxnjJ7Gfc00vIWVvVVe4VpLjiKb45647tEZLozDD0Bpif4gjE1e9wG00sjeHGb24" --scope=production,preview,development -y

echo Adding STRIPE_WEBHOOK_SECRET...
vercel env add STRIPE_WEBHOOK_SECRET "whsec_51c59e7472f3ee8c140dfb98b9967f76cf78aad097f1a1971a515b02cbda8990" --scope=production,preview,development -y

echo All essential environment variables have been added.
echo Now you can redeploy your application with: vercel --prod

pause