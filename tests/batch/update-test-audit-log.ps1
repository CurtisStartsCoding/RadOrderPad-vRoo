# Update Test Audit Log
# This script updates the Test Audit Log section in the README.md file with the current date and status
# Usage: .\update-test-audit-log.ps1 -TestName "Connection Management Tests" -Status "PASS" -Notes "All tests passing after connection service refactoring"

param (
    [Parameter(Mandatory=$true)]
    [string]$TestName,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("PASS", "FAIL")]
    [string]$Status,
    
    [Parameter(Mandatory=$false)]
    [string]$Notes = ""
)

# Get the current date and time
$currentDate = Get-Date -Format "MMMM d, yyyy h:mm tt"

# Path to the README.md file
$readmePath = Join-Path $PSScriptRoot "README.md"

# Read the content of the README.md file
$content = Get-Content $readmePath -Raw

# Create the new table row
$newRow = "| **$TestName** | $currentDate | $Status | $Notes |"

# Check if the test already exists in the table
$pattern = "\| \*\*$([regex]::Escape($TestName))\*\* \|.*\|.*\|.*\|"
if ($content -match $pattern) {
    # Update the existing row
    $content = [regex]::Replace($content, $pattern, $newRow)
} else {
    # Find the table and add a new row
    $tablePattern = "\| Test Name \| Last Run Date \| Status \| Notes \|\r?\n\|.*\|.*\|.*\|.*\|(\r?\n\|.*\|.*\|.*\|.*\|)*"
    if ($content -match $tablePattern) {
        $table = $Matches[0]
        $newTable = $table + "`n$newRow"
        $content = $content -replace [regex]::Escape($table), $newTable
    } else {
        Write-Error "Could not find the test audit log table in the README.md file."
        exit 1
    }
}

# Write the updated content back to the README.md file
Set-Content -Path $readmePath -Value $content

Write-Host "Updated test audit log for '$TestName' with status '$Status' and date '$currentDate'."