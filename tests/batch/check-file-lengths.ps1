# Script to check file lengths and identify files that need refactoring
# Usage: .\check-file-lengths.ps1 [path] [extension]
# Example: .\check-file-lengths.ps1 ..\..\src ts

param (
    [string]$path = "..\..\src",
    [string]$extension = "ts"
)

# Define thresholds
$warningThreshold = 100  # Files approaching refactor status
$criticalThreshold = 150  # Files that need immediate refactoring

# Get all files with the specified extension
$files = Get-ChildItem -Path $path -Recurse -Filter "*.$extension" | Where-Object { !$_.PSIsContainer }

# Initialize arrays to store results
$criticalFiles = @()
$warningFiles = @()
$okFiles = @()

# Process each file
foreach ($file in $files) {
    $lineCount = (Get-Content $file.FullName | Measure-Object -Line).Lines
    $relativePath = $file.FullName.Replace((Resolve-Path $path).Path + "\", "")
    
    $fileInfo = [PSCustomObject]@{
        Path = $relativePath
        LineCount = $lineCount
    }
    
    if ($lineCount -ge $criticalThreshold) {
        $criticalFiles += $fileInfo
    } elseif ($lineCount -ge $warningThreshold) {
        $warningFiles += $fileInfo
    } else {
        $okFiles += $fileInfo
    }
}

# Sort files by line count (descending)
$criticalFiles = $criticalFiles | Sort-Object -Property LineCount -Descending
$warningFiles = $warningFiles | Sort-Object -Property LineCount -Descending
$okFiles = $okFiles | Sort-Object -Property LineCount -Descending

# Generate report
Write-Host "===== FILE LENGTH REPORT ====="
Write-Host "Path: $path"
Write-Host "Extension: .$extension"
Write-Host "Total files: $($files.Count)"
Write-Host ""

Write-Host "===== CRITICAL (>= $criticalThreshold lines) ====="
Write-Host "Count: $($criticalFiles.Count)"
if ($criticalFiles.Count -gt 0) {
    $criticalFiles | Format-Table -Property Path, LineCount -AutoSize
}

Write-Host "===== WARNING (>= $warningThreshold lines) ====="
Write-Host "Count: $($warningFiles.Count)"
if ($warningFiles.Count -gt 0) {
    $warningFiles | Format-Table -Property Path, LineCount -AutoSize
}

Write-Host "===== SUMMARY ====="
Write-Host "Critical files: $($criticalFiles.Count) ($('{0:P1}' -f ($criticalFiles.Count / $files.Count)))"
Write-Host "Warning files: $($warningFiles.Count) ($('{0:P1}' -f ($warningFiles.Count / $files.Count)))"
Write-Host "OK files: $($okFiles.Count) ($('{0:P1}' -f ($okFiles.Count / $files.Count)))"

# Export to CSV
$allFiles = $criticalFiles + $warningFiles + $okFiles
$allFiles | Export-Csv -Path "file-length-report.csv" -NoTypeInformation

Write-Host ""
Write-Host "Report exported to file-length-report.csv"