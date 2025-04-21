# PowerShell script to find files modified today after 10:15 AM Eastern Time
# This script will be more accurate than the previous search

# Set Eastern Time Zone
$easternZone = [System.TimeZoneInfo]::FindSystemTimeZoneById("Eastern Standard Time")
$today = Get-Date -Format "MM/dd/yyyy"
$startTimeUtc = [System.TimeZoneInfo]::ConvertTimeFromUtc(
    [DateTime]::Parse("$today 10:15:00 AM").ToUniversalTime(), 
    $easternZone
)
$currentTimeEastern = [System.TimeZoneInfo]::ConvertTimeFromUtc(
    (Get-Date).ToUniversalTime(), 
    $easternZone
)

Write-Host "Finding files modified between $startTimeUtc and $currentTimeEastern (Eastern Time)..."
Write-Host "This will exclude compiled files and focus on source code and configuration files."

# Get all files modified after the specified time
$modifiedFiles = Get-ChildItem -Path . -Recurse -File | 
    Where-Object { 
        $fileTimeUtc = $_.LastWriteTime.ToUniversalTime()
        $fileTimeEastern = [System.TimeZoneInfo]::ConvertTimeFromUtc($fileTimeUtc, $easternZone)
        
        $fileTimeEastern -gt $startTimeUtc -and 
        # Exclude compiled files, node_modules, and other non-source files
        -not ($_.FullName -like "*\node_modules\*") -and
        -not ($_.FullName -like "*\dist\*") -and
        -not ($_.FullName -like "*\debug-scripts\*") -and
        -not ($_.FullName -like "*\.git\*") -and
        # Focus on source code and configuration files
        ($_.Extension -in ".ts", ".js", ".sql", ".json", ".md", ".bat", ".sh")
    } | 
    Sort-Object LastWriteTime

# Display the results
Write-Host "`nFound $($modifiedFiles.Count) modified files:`n"

$modifiedFiles | ForEach-Object {
    $fileTimeUtc = $_.LastWriteTime.ToUniversalTime()
    $fileTimeEastern = [System.TimeZoneInfo]::ConvertTimeFromUtc($fileTimeUtc, $easternZone)
    $relativePath = $_.FullName.Replace("$PWD\", "")
    Write-Host "[$($fileTimeEastern.ToString('HH:mm:ss'))] $relativePath"
}

# Group files by directory to identify areas of change
Write-Host "`nChanges by directory:"
$modifiedFiles | 
    ForEach-Object { $_.DirectoryName.Replace("$PWD\", "") } | 
    Group-Object | 
    Sort-Object Count -Descending | 
    ForEach-Object {
        Write-Host "$($_.Count) files in $($_.Name)"
    }

# Save results to a file
$outputFile = "recent-changes.txt"
"Files modified after 10:15 AM on $today (Eastern Time)`n" | Out-File $outputFile
$modifiedFiles | ForEach-Object {
    $fileTimeUtc = $_.LastWriteTime.ToUniversalTime()
    $fileTimeEastern = [System.TimeZoneInfo]::ConvertTimeFromUtc($fileTimeUtc, $easternZone)
    $relativePath = $_.FullName.Replace("$PWD\", "")
    "[$($fileTimeEastern.ToString('HH:mm:ss'))] $relativePath" | Out-File $outputFile -Append
} 
Write-Host "`nResults saved to $outputFile"