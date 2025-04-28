#!/bin/bash
echo "Running Deployment Configuration Audit..."
cd "$(dirname "$0")"
node audit-deployment-config.js
echo ""
echo "If the audit completed successfully, check the deployment-audit-report.md file for results."