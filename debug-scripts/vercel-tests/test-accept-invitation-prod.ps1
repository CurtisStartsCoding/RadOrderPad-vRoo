# PowerShell script to test the accept-invitation endpoint against production

Write-Host "Testing accept-invitation endpoint on production..." -ForegroundColor Green

# Load environment variables from .env.production file
Get-Content .env.production | ForEach-Object {
    if ($_ -match '(.+)=(.+)') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}

# Set API base URL for production
$apiUrl = "https://api.radorderpad.com/api"

# Generate a test token for testing
$testToken = [System.Guid]::NewGuid().ToString()

# Create a test invitation in the database
Write-Host "Creating test invitation..." -ForegroundColor Cyan
$script = @"
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.MAIN_DATABASE_URL });
(async () => {
    try {
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        await pool.query('INSERT INTO user_invitations (organization_id, invited_by_user_id, email, role, token, expires_at, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())', 
            [1, 1, 'test-invitation@example.com', 'physician', '$testToken', expiryDate.toISOString(), 'pending']);
        console.log('Test invitation created successfully');
    } catch (err) {
        console.error('Error creating test invitation:', err);
    } finally {
        pool.end();
    }
})();
"@

node -e $script

# Wait a moment for the database operation to complete
Start-Sleep -Seconds 2

# Test 1: Valid invitation acceptance
Write-Host "`nTest 1: Valid invitation acceptance" -ForegroundColor Cyan
$body = @{
    token = $testToken
    password = "Password123"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/user-invites/accept-invitation" -Method POST -Headers @{
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

# Test 2: Invalid token
Write-Host "`nTest 2: Invalid token" -ForegroundColor Cyan
$body = @{
    token = "invalid-token"
    password = "Password123"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/user-invites/accept-invitation" -Method POST -Headers @{
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

# Test 3: Missing required fields
Write-Host "`nTest 3: Missing required fields" -ForegroundColor Cyan
$body = @{
    token = $testToken
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/user-invites/accept-invitation" -Method POST -Headers @{
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

# Test 4: Weak password
Write-Host "`nTest 4: Weak password" -ForegroundColor Cyan
$body = @{
    token = $testToken
    password = "weak"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/user-invites/accept-invitation" -Method POST -Headers @{
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

# Clean up test data
Write-Host "`nCleaning up test data..." -ForegroundColor Cyan
$script = @"
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.MAIN_DATABASE_URL });
(async () => {
    try {
        await pool.query('DELETE FROM users WHERE email = $1', ['test-invitation@example.com']);
        await pool.query('DELETE FROM user_invitations WHERE email = $1', ['test-invitation@example.com']);
        console.log('Test data cleaned up successfully');
    } catch (err) {
        console.error('Error cleaning up test data:', err);
    } finally {
        pool.end();
    }
})();
"@

node -e $script

Write-Host "`nTesting completed." -ForegroundColor Green