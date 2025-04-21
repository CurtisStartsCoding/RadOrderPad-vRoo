@echo off
REM Script to delete all environment variables from a Vercel project

echo Installing Vercel CLI...
npm i -g vercel

echo Logging in to Vercel...
vercel login

echo Listing all environment variables...
vercel env ls

echo Creating a list of all environment variables...
vercel env ls > env-vars.txt

echo Removing all environment variables...
for /f "tokens=1" %%a in (env-vars.txt) do (
    echo Removing %%a...
    vercel env rm %%a -y
)

echo Deleting temporary file...
del env-vars.txt

echo All environment variables have been removed.
echo Now you can add the essential variables:
echo NODE_ENV=production
echo MAIN_DATABASE_URL=postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=require
echo PHI_DATABASE_URL=postgresql://postgres:SimplePassword123@radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=require

pause