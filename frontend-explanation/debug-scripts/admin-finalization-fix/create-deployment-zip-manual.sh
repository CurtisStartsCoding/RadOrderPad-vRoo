#!/bin/bash

echo "Creating deployment ZIP file manually..."

# Check if 7-Zip is installed
if command -v 7z &> /dev/null; then
    # Create the deployment ZIP file using 7-Zip
    echo "Creating deployment.zip using 7-Zip..."
    7z a -tzip deployment-manual.zip ./deployment/* -r
elif command -v zip &> /dev/null; then
    # Create the deployment ZIP file using zip
    echo "Creating deployment.zip using zip..."
    cd deployment
    zip -r ../deployment-manual.zip ./*
    cd ..
else
    # Create the deployment ZIP file using Python (if available)
    if command -v python3 &> /dev/null; then
        echo "Creating deployment.zip using Python..."
        python3 -c "
import zipfile, os
with zipfile.ZipFile('deployment-manual.zip', 'w') as zipf:
    for root, dirs, files in os.walk('deployment'):
        for file in files:
            zipf.write(os.path.join(root, file), 
                      os.path.relpath(os.path.join(root, file), 
                                     os.path.join('deployment', '..')))
"
    elif command -v python &> /dev/null; then
        echo "Creating deployment.zip using Python..."
        python -c "
import zipfile, os
with zipfile.ZipFile('deployment-manual.zip', 'w') as zipf:
    for root, dirs, files in os.walk('deployment'):
        for file in files:
            zipf.write(os.path.join(root, file), 
                      os.path.relpath(os.path.join(root, file), 
                                     os.path.join('deployment', '..')))
"
    else
        echo "Error: No zip utility found. Please install zip, 7z, or Python."
        exit 1
    fi
fi

if [ -f deployment-manual.zip ]; then
    echo "Deployment package created: deployment-manual.zip"
else
    echo "Failed to create deployment package."
fi

echo
echo "Next steps:"
echo "1. Upload deployment-manual.zip to AWS Elastic Beanstalk"
echo "2. Configure environment variables in the Elastic Beanstalk console"
echo "3. Deploy the application"

read -p "Press Enter to continue..."