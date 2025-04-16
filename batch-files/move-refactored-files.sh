#!/bin/bash
echo "Moving files to old_code directory..."

echo "Moving Clinical Record Manager..."
mkdir -p "src\services\order\admin"
cp "src\services\order\admin\clinical-record-manager.ts" "src\services\order\admin\clinical-record-manager.ts"
rm "src\services\order\admin\clinical-record-manager.ts"

echo "Moving Order Status Manager..."
mkdir -p "src\services\order\admin"
cp "src\services\order\admin\order-status-manager.ts" "src\services\order\admin\order-status-manager.ts"
rm "src\services\order\admin\order-status-manager.ts"

echo "Moving Order Export Service..."
mkdir -p "src\services\order\radiology"
cp "src\services\order\radiology\order-export.service.ts" "src\services\order\radiology\order-export.service.ts"
rm "src\services\order\radiology\order-export.service.ts"

echo "Moving Keyword Extractor..."
mkdir -p "src\utils\text-processing"
cp "src\utils\text-processing\keyword-extractor.ts" "src\utils\text-processing\keyword-extractor.ts"
rm "src\utils\text-processing\keyword-extractor.ts"

echo "Moving Connection List Controller..."
mkdir -p "src\controllers\connection"
cp "src\controllers\connection\list.controller.ts" "src\controllers\connection\list.controller.ts"
rm "src\controllers\connection\list.controller.ts"

echo "Moving Connection Validation Utils..."
mkdir -p "src\controllers\connection"
cp "src\controllers\connection\validation-utils.ts" "src\controllers\connection\validation-utils.ts"
rm "src\controllers\connection\validation-utils.ts"

echo "Moving Request Connection Helpers..."
mkdir -p "src\services\connection\services"
cp "src\services\connection\services\request-connection-helpers.ts" "src\services\connection\services\request-connection-helpers.ts"
rm "src\services\connection\services\request-connection-helpers.ts"

echo "Moving File Upload Service..."
mkdir -p "src\services"
cp "src\services\fileUpload.service.ts" "src\services\fileUpload.service.ts"
rm "src\services\fileUpload.service.ts"

echo "Moving Email Test Mode..."
mkdir -p "src\services\notification\email-sender"
cp "src\services\notification\email-sender\test-mode.ts" "src\services\notification\email-sender\test-mode.ts"
rm "src\services\notification\email-sender\test-mode.ts"

echo "Moving Connection Approval..."
mkdir -p "src\services\notification\services\connection"
cp "src\services\notification\services\connection\approval.ts" "src\services\notification\services\connection\approval.ts"
rm "src\services\notification\services\connection\approval.ts"

echo "Moving Connection Rejection..."
mkdir -p "src\services\notification\services\connection"
cp "src\services\notification\services\connection\rejection.ts" "src\services\notification\services\connection\rejection.ts"
rm "src\services\notification\services\connection\rejection.ts"

echo "Moving Connection Termination..."
mkdir -p "src\services\notification\services\connection"
cp "src\services\notification\services\connection\termination.ts" "src\services\notification\services\connection\termination.ts"
rm "src\services\notification\services\connection\termination.ts"

echo "Moving Patient Manager..."
mkdir -p "src\services\order\admin"
cp "src\services\order\admin\patient-manager.ts" "src\services\order\admin\patient-manager.ts"
rm "src\services\order\admin\patient-manager.ts"

echo "Moving Query Builder..."
mkdir -p "src\services\order\admin\utils"
cp "src\services\order\admin\utils\query-builder.ts" "src\services\order\admin\utils\query-builder.ts"
rm "src\services\order\admin\utils\query-builder.ts"

echo "Moving CSV Export..."
mkdir -p "src\services\order\radiology\export"
cp "src\services\order\radiology\export\csv-export.ts" "src\services\order\radiology\export\csv-export.ts"
rm "src\services\order\radiology\export\csv-export.ts"

echo "Moving Metadata Filters..."
mkdir -p "src\services\order\radiology\query\order-builder"
cp "src\services\order\radiology\query\order-builder\metadata-filters.ts" "src\services\order\radiology\query\order-builder\metadata-filters.ts"
rm "src\services\order\radiology\query\order-builder\metadata-filters.ts"

echo "Moving Attempt Tracking..."
mkdir -p "src\services\order\validation"
cp "src\services\order\validation\attempt-tracking.ts" "src\services\order\validation\attempt-tracking.ts"
rm "src\services\order\validation\attempt-tracking.ts"

echo "Moving Response Normalizer..."
mkdir -p "src\utils\response"
cp "src\utils\response\normalizer.ts" "src\utils\response\normalizer.ts"
rm "src\utils\response\normalizer.ts"

echo "Moving Response Validator..."
mkdir -p "src\utils\response"
cp "src\utils\response\validator.ts" "src\utils\response\validator.ts"
rm "src\utils\response\validator.ts"

echo "Done!"
read -p "Press enter to continue"