@echo off
echo Saving current environment details...

set OUTPUT_FILE=environment-snapshot.md

echo # RadOrderPad Environment Snapshot > %OUTPUT_FILE%
echo Created: %date% %time% >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

echo ## VSCode Open Tabs >> %OUTPUT_FILE%
echo The following files were open in VSCode at the time of snapshot: >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for /f "tokens=*" %%a in ('dir /b /s *.ts *.js *.md *.json *.bat *.sh *.sql *.html *.css *.yml *.yaml 2^>nul') do (
    echo - %%a >> %OUTPUT_FILE%
)

echo. >> %OUTPUT_FILE%
echo ## Project Structure >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%
echo ```text >> %OUTPUT_FILE%
dir /s /b >> %OUTPUT_FILE%
echo ``` >> %OUTPUT_FILE%

echo. >> %OUTPUT_FILE%
echo ## Git Status >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%
echo ```text >> %OUTPUT_FILE%
git status >> %OUTPUT_FILE%
echo ``` >> %OUTPUT_FILE%

echo. >> %OUTPUT_FILE%
echo ## Recent Git Commits >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%
echo ```text >> %OUTPUT_FILE%
git log --max-count=10 --pretty=format:"%%h - %%an, %%ar : %%s" >> %OUTPUT_FILE%
echo ``` >> %OUTPUT_FILE%

echo. >> %OUTPUT_FILE%
echo ## Node.js Environment >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%
echo ```text >> %OUTPUT_FILE%
node --version >> %OUTPUT_FILE%
npm --version >> %OUTPUT_FILE%
echo ``` >> %OUTPUT_FILE%

echo. >> %OUTPUT_FILE%
echo ## Package Dependencies >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%
echo ```json >> %OUTPUT_FILE%
type package.json >> %OUTPUT_FILE%
echo ``` >> %OUTPUT_FILE%

echo Environment details saved to %OUTPUT_FILE%
echo You can now commit this file to your Git repository to preserve the environment details.
echo.
echo To add this file to your Git commit, run:
echo git add %OUTPUT_FILE%