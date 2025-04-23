@echo off
echo ===== Copying dist directory to vercel-deploy =====
xcopy /E /Y /I dist vercel-deploy\dist

echo ===== Copying configuration files to vercel-deploy =====
xcopy /Y package.json vercel-deploy\
xcopy /Y vercel.json vercel-deploy\
xcopy /Y tsconfig.json vercel-deploy\

echo ===== Deploying to Vercel =====
cd vercel-deploy
vercel --force

echo ===== Deployment completed =====