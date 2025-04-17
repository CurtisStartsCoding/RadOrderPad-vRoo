@echo off
echo RadOrderPad Clinical Workflow Simulation
echo =========================================

set /p num_cases="Enter number of test cases to run: "

if "%num_cases%"=="" (
  set num_cases=3
  echo Using default: 3 test cases
)

echo Running %num_cases% test cases...
node tests/clinical-workflow-simulation.js %num_cases%

pause