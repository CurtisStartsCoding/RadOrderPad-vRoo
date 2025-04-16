# PowerShell script to move debug scripts to the debug-scripts directory

$files = @(
    "check-database-connection.js",
    "check-prompt-content.js",
    "check-word-limit.js",
    "debug-token-auth.js",
    "debug-validation-endpoint.js",
    "debug-validation-response.js",
    "get-full-prompt-content.js",
    "update-active-template.js",
    "update-prompt-content.js",
    "update-word-limit.js",
    "activate-comprehensive-prompt.js",
    "fix-prompt-template.js",
    "restore-database.js",
    "full_prompt_template_2.txt",
    "prompt_template_2.txt"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Moving $file to debug-scripts\"
        Move-Item -Path $file -Destination "debug-scripts\" -Force
    } else {
        Write-Host "File $file not found, skipping"
    }
}

Write-Host "All debug scripts moved to debug-scripts\"