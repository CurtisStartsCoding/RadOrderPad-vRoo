@echo off
echo Running Trial Feature Tests...
cd %~dp0\..\..
set NODE_ENV=test
npx mocha tests/trial-feature.test.js --timeout 10000