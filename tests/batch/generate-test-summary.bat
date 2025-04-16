@echo off
REM Script to generate a consolidated test summary report
echo Generating test summary report...
echo.

REM Check if test-results directory exists
if not exist "test-results" (
    echo Error: test-results directory not found. Please run the tests first.
    exit /b 1
)

REM Create summary file
set SUMMARY_FILE=test-results\test-summary.md
echo # RadOrderPad Test Summary > %SUMMARY_FILE%
echo. >> %SUMMARY_FILE%
echo Generated on %DATE% at %TIME% >> %SUMMARY_FILE%
echo. >> %SUMMARY_FILE%
echo ## Test Results >> %SUMMARY_FILE%
echo. >> %SUMMARY_FILE%
echo ^| Test Suite ^| Status ^| Details ^| >> %SUMMARY_FILE%
echo ^| ---------- ^| ------ ^| ------- ^| >> %SUMMARY_FILE%

REM Process validation tests
if exist "test-results\validation-tests.log" (
    findstr /C:"[PASS]" test-results\validation-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo ^| Validation Tests ^| PASS ^| Order validation with real LLM integration ^| >> %SUMMARY_FILE%
    ) else (
        echo ^| Validation Tests ^| FAIL ^| See validation-tests.log for details ^| >> %SUMMARY_FILE%
    )
) else (
    echo ^| Validation Tests ^| SKIPPED ^| Test not run ^| >> %SUMMARY_FILE%
)

REM Process order finalization tests
if exist "test-results\order-finalization-tests.log" (
    findstr /C:"[PASS]" test-results\order-finalization-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo ^| Order Finalization Tests ^| PASS ^| Physician order finalization with temporary patient creation ^| >> %SUMMARY_FILE%
    ) else (
        echo ^| Order Finalization Tests ^| FAIL ^| See order-finalization-tests.log for details ^| >> %SUMMARY_FILE%
    )
) else (
    echo ^| Order Finalization Tests ^| SKIPPED ^| Test not run ^| >> %SUMMARY_FILE%
)

REM Process upload tests
if exist "test-results\upload-tests.log" (
    findstr /C:"[PASS]" test-results\upload-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo ^| Upload Tests ^| PASS ^| File upload service and presigned URL generation ^| >> %SUMMARY_FILE%
    ) else (
        echo ^| Upload Tests ^| FAIL ^| See upload-tests.log for details ^| >> %SUMMARY_FILE%
    )
) else (
    echo ^| Upload Tests ^| SKIPPED ^| Test not run ^| >> %SUMMARY_FILE%
)

REM Process admin finalization tests
if exist "test-results\admin-finalization-tests.log" (
    findstr /C:"[PASS]" test-results\admin-finalization-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo ^| Admin Finalization Tests ^| PASS ^| Order finalization workflow ^| >> %SUMMARY_FILE%
    ) else (
        echo ^| Admin Finalization Tests ^| FAIL ^| See admin-finalization-tests.log for details ^| >> %SUMMARY_FILE%
    )
) else (
    echo ^| Admin Finalization Tests ^| SKIPPED ^| Test not run ^| >> %SUMMARY_FILE%
)

REM Process connection tests
if exist "test-results\connection-tests.log" (
    findstr /C:"[PASS]" test-results\connection-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo ^| Connection Management Tests ^| PASS ^| Organization connection management ^| >> %SUMMARY_FILE%
    ) else (
        echo ^| Connection Management Tests ^| FAIL ^| See connection-tests.log for details ^| >> %SUMMARY_FILE%
    )
) else (
    echo ^| Connection Management Tests ^| SKIPPED ^| Test not run ^| >> %SUMMARY_FILE%
)

REM Process location tests
if exist "test-results\location-tests.log" (
    findstr /C:"[PASS]" test-results\location-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo ^| Location Management Tests ^| PASS ^| Organization location management ^| >> %SUMMARY_FILE%
    ) else (
        echo ^| Location Management Tests ^| FAIL ^| See location-tests.log for details ^| >> %SUMMARY_FILE%
    )
) else (
    echo ^| Location Management Tests ^| SKIPPED ^| Test not run ^| >> %SUMMARY_FILE%
)

REM Process radiology workflow tests
if exist "test-results\radiology-workflow-tests.log" (
    findstr /C:"[PASS]" test-results\radiology-workflow-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo ^| Radiology Workflow Tests ^| PASS ^| Radiology group order management ^| >> %SUMMARY_FILE%
    ) else (
        echo ^| Radiology Workflow Tests ^| FAIL ^| See radiology-workflow-tests.log for details ^| >> %SUMMARY_FILE%
    )
) else (
    echo ^| Radiology Workflow Tests ^| SKIPPED ^| Test not run ^| >> %SUMMARY_FILE%
)

echo. >> %SUMMARY_FILE%
echo ## Core Functionality Status >> %SUMMARY_FILE%
echo. >> %SUMMARY_FILE%

REM Check user registration and login
echo ### User Registration ^& Login >> %SUMMARY_FILE%
if exist "test-results\connection-tests.log" (
    findstr /C:"Generating JWT token" test-results\connection-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo User authentication is working >> %SUMMARY_FILE%
    ) else (
        echo User authentication issues detected >> %SUMMARY_FILE%
    )
) else (
    echo Not tested >> %SUMMARY_FILE%
)
echo. >> %SUMMARY_FILE%

REM Check order validation
echo ### Physician Order Validation >> %SUMMARY_FILE%
if exist "test-results\validation-tests.log" (
    findstr /C:"validation successful" test-results\validation-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo Order validation with real LLM is working >> %SUMMARY_FILE%
    ) else (
        echo Order validation issues detected >> %SUMMARY_FILE%
    )
) else (
    echo Not tested >> %SUMMARY_FILE%
)
echo. >> %SUMMARY_FILE%

REM Check order finalization
echo ### Order Finalization >> %SUMMARY_FILE%
if exist "test-results\admin-finalization-tests.log" (
    findstr /C:"finalization successful" test-results\admin-finalization-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo Order finalization is working >> %SUMMARY_FILE%
    ) else (
        echo Order finalization issues detected >> %SUMMARY_FILE%
    )
) else (
    echo Not tested >> %SUMMARY_FILE%
)
echo. >> %SUMMARY_FILE%

REM Check user management
echo ### User Management >> %SUMMARY_FILE%
if exist "test-results\admin-finalization-tests.log" (
    findstr /C:"user management" test-results\admin-finalization-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo User management is working >> %SUMMARY_FILE%
    ) else (
        echo User management not explicitly tested >> %SUMMARY_FILE%
    )
) else (
    echo Not tested >> %SUMMARY_FILE%
)
echo. >> %SUMMARY_FILE%

REM Check location management
echo ### Location Management >> %SUMMARY_FILE%
if exist "test-results\location-tests.log" (
    findstr /C:"[PASS]" test-results\location-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo Location management is working >> %SUMMARY_FILE%
    ) else (
        echo Location management issues detected >> %SUMMARY_FILE%
    )
) else (
    echo Not tested >> %SUMMARY_FILE%
)
echo. >> %SUMMARY_FILE%

REM Check connection management
echo ### Connection Management >> %SUMMARY_FILE%
if exist "test-results\connection-tests.log" (
    findstr /C:"[PASS]" test-results\connection-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo Connection management is working >> %SUMMARY_FILE%
    ) else (
        echo Connection management issues detected >> %SUMMARY_FILE%
    )
) else (
    echo Not tested >> %SUMMARY_FILE%
)
echo. >> %SUMMARY_FILE%

REM Check file upload
echo ### File Upload >> %SUMMARY_FILE%
if exist "test-results\upload-tests.log" (
    findstr /C:"[PASS]" test-results\upload-tests.log > nul
    if %ERRORLEVEL% EQU 0 (
        echo File upload service is working >> %SUMMARY_FILE%
    ) else (
        echo File upload issues detected >> %SUMMARY_FILE%
    )
) else (
    echo Not tested >> %SUMMARY_FILE%
)
echo. >> %SUMMARY_FILE%

echo Summary report generated: %SUMMARY_FILE%
echo.