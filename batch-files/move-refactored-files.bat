@echo off
echo Moving files to old_code directory...

echo Moving Clinical Record Manager...
mkdir "src\services\order\admin" 2>nul
copy "src\services\order\admin\clinical-record-manager.ts" "src\services\order\admin\clinical-record-manager.ts"
del "src\services\order\admin\clinical-record-manager.ts"

echo Moving Order Status Manager...
mkdir "src\services\order\admin" 2>nul
copy "src\services\order\admin\order-status-manager.ts" "src\services\order\admin\order-status-manager.ts"
del "src\services\order\admin\order-status-manager.ts"

echo Moving Order Export Service...
mkdir "src\services\order\radiology" 2>nul
copy "src\services\order\radiology\order-export.service.ts" "src\services\order\radiology\order-export.service.ts"
del "src\services\order\radiology\order-export.service.ts"

echo Moving Keyword Extractor...
mkdir "src\utils\text-processing" 2>nul
copy "src\utils\text-processing\keyword-extractor.ts" "src\utils\text-processing\keyword-extractor.ts"
del "src\utils\text-processing\keyword-extractor.ts"

echo Moving Connection List Controller...
mkdir "src\controllers\connection" 2>nul
copy "src\controllers\connection\list.controller.ts" "src\controllers\connection\list.controller.ts"
del "src\controllers\connection\list.controller.ts"

echo Moving Connection Validation Utils...
mkdir "src\controllers\connection" 2>nul
copy "src\controllers\connection\validation-utils.ts" "src\controllers\connection\validation-utils.ts"
del "src\controllers\connection\validation-utils.ts"

echo Moving Request Connection Helpers...
mkdir "src\services\connection\services" 2>nul
copy "src\services\connection\services\request-connection-helpers.ts" "src\services\connection\services\request-connection-helpers.ts"
del "src\services\connection\services\request-connection-helpers.ts"

echo Moving File Upload Service...
mkdir "src\services" 2>nul
copy "src\services\fileUpload.service.ts" "src\services\fileUpload.service.ts"
del "src\services\fileUpload.service.ts"

echo Moving Email Test Mode...
mkdir "src\services\notification\email-sender" 2>nul
copy "src\services\notification\email-sender\test-mode.ts" "src\services\notification\email-sender\test-mode.ts"
del "src\services\notification\email-sender\test-mode.ts"

echo Moving Connection Approval...
mkdir "src\services\notification\services\connection" 2>nul
copy "src\services\notification\services\connection\approval.ts" "src\services\notification\services\connection\approval.ts"
del "src\services\notification\services\connection\approval.ts"

echo Moving Connection Rejection...
mkdir "src\services\notification\services\connection" 2>nul
copy "src\services\notification\services\connection\rejection.ts" "src\services\notification\services\connection\rejection.ts"
del "src\services\notification\services\connection\rejection.ts"

echo Moving Connection Termination...
mkdir "src\services\notification\services\connection" 2>nul
copy "src\services\notification\services\connection\termination.ts" "src\services\notification\services\connection\termination.ts"
del "src\services\notification\services\connection\termination.ts"

echo Moving Patient Manager...
mkdir "src\services\order\admin" 2>nul
copy "src\services\order\admin\patient-manager.ts" "src\services\order\admin\patient-manager.ts"
del "src\services\order\admin\patient-manager.ts"

echo Moving Query Builder...
mkdir "src\services\order\admin\utils" 2>nul
copy "src\services\order\admin\utils\query-builder.ts" "src\services\order\admin\utils\query-builder.ts"
del "src\services\order\admin\utils\query-builder.ts"

echo Moving CSV Export...
mkdir "src\services\order\radiology\export" 2>nul
copy "src\services\order\radiology\export\csv-export.ts" "src\services\order\radiology\export\csv-export.ts"
del "src\services\order\radiology\export\csv-export.ts"

echo Moving Metadata Filters...
mkdir "src\services\order\radiology\query\order-builder" 2>nul
copy "src\services\order\radiology\query\order-builder\metadata-filters.ts" "src\services\order\radiology\query\order-builder\metadata-filters.ts"
del "src\services\order\radiology\query\order-builder\metadata-filters.ts"

echo Moving Attempt Tracking...
mkdir "src\services\order\validation" 2>nul
copy "src\services\order\validation\attempt-tracking.ts" "src\services\order\validation\attempt-tracking.ts"
del "src\services\order\validation\attempt-tracking.ts"

echo Moving Response Normalizer...
mkdir "src\utils\response" 2>nul
copy "src\utils\response\normalizer.ts" "src\utils\response\normalizer.ts"
del "src\utils\response\normalizer.ts"

echo Moving Response Validator...
mkdir "src\utils\response" 2>nul
copy "src\utils\response\validator.ts" "src\utils\response\validator.ts"
del "src\utils\response\validator.ts"

echo Done!
pause