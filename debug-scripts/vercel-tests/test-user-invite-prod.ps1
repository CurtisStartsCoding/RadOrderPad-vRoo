# PowerShell script to test the user invite endpoint against production

Write-Host "Testing User Invitation Endpoint (Production)" -ForegroundColor Green

# Get admin token
$adminToken = node debug-scripts/vercel-tests/get-clean-token.js admin_referring

# Set production API URL
$apiUrl = "https://api.radorderpad.com/api"

Write-Host "`nTest 1: Valid data (admin_referring token)" -ForegroundColor Cyan
$body = @{
    email = "test.user@example.com"
    role = "physician"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/user-invites/invite" -Method POST -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $adminToken"
    } -Body $body -ErrorAction Stop
    
    Write-Host "Status: $($response.StatusCode)"
    Write-Host $response.Content
}
catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

Write-Host "`nTest 2: Invalid email format" -ForegroundColor Cyan
$body = @{
    email = "invalid-email"
    role = "physician"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/user-invites/invite" -Method POST -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $adminToken"
    } -Body $body -ErrorAction Stop
    
    Write-Host "Status: $($response.StatusCode)"
    Write-Host $response.Content
}
catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

Write-Host "`nTest 3: Without token (should fail with 401)" -ForegroundColor Cyan
$body = @{
    email = "test.user@example.com"
    role = "physician"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/user-invites/invite" -Method POST -Headers @{
        "Content-Type" = "application/json"
    } -Body $body -ErrorAction Stop
    
    Write-Host "Status: $($response.StatusCode)"
    Write-Host $response.Content
}
catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

Write-Host "`nTesting completed." -ForegroundColor Green