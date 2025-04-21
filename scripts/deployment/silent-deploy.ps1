# Silent Vercel Deployment Script
Write-Host "===== DEPLOYING TO VERCEL (SILENT MODE) ====="

# Check if deployment-manual.zip exists
if (-not (Test-Path "C:\Users\JB\Dropbox (Personal)\Apps\ROP Roo Backend Finalization\deployment-manual.zip")) {
    Write-Host "Error: deployment-manual.zip not found at specified path."
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    if (-not $?) {
        Write-Host "Error: Vercel CLI not found."
        Write-Host "Please install the Vercel CLI: npm install -g vercel"
        exit 1
    }
} catch {
    Write-Host "Error: Vercel CLI not found."
    Write-Host "Please install the Vercel CLI: npm install -g vercel"
    exit 1
}

# Create a temporary directory for extraction
Write-Host "Cleaning up any existing temporary directory..."
if (Test-Path "temp-extract") {
    $ProgressPreference = 'SilentlyContinue'  # Suppress progress bars
    Remove-Item -Path "temp-extract" -Recurse -Force -ErrorAction SilentlyContinue 2>$null | Out-Null
    $ProgressPreference = 'Continue'  # Reset to default
}
Write-Host "Creating fresh temporary directory..."
New-Item -Path "temp-extract" -ItemType Directory -ErrorAction SilentlyContinue 2>$null | Out-Null

# Extract the ZIP file silently with absolutely no output
Write-Host "Extracting deployment package silently..."
try {
    $ProgressPreference = 'SilentlyContinue'  # Completely suppress progress bars
    Expand-Archive -Path "C:\Users\JB\Dropbox (Personal)\Apps\ROP Roo Backend Finalization\deployment-manual.zip" -DestinationPath "temp-extract" -Force -ErrorAction Stop 2>$null | Out-Null
    $ProgressPreference = 'Continue'  # Reset to default
} catch {
    Write-Host "Error extracting ZIP file: $_"
    exit 1
}

# Check if user is logged in to Vercel
Write-Host "Checking Vercel login status..."
try {
    $vercelWhoami = vercel whoami 2>&1
    $loginStatus = $LASTEXITCODE
    
    if ($loginStatus -ne 0) {
        Write-Host "You are not logged in to Vercel. Please run 'vercel login' first."
        Write-Host "After logging in, run this script again."
        exit 1
    } else {
        Write-Host "Logged in to Vercel as: $vercelWhoami"
    }
} catch {
    Write-Host "Error checking Vercel login status: $_"
    exit 1
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..."
try {
    Push-Location -Path "temp-extract"
    $deployResult = vercel --prod --yes 2>&1
    $exitCode = $LASTEXITCODE
    Pop-Location
    
    if ($exitCode -eq 0) {
        Write-Host "Deployment to Vercel completed successfully!"
    } else {
        Write-Host "Deployment to Vercel failed with error code: $exitCode"
        Write-Host "Please check your Vercel configuration or project settings."
    }
} catch {
    Write-Host "Error during deployment: $_"
    exit 1
} finally {
    # Clean up
    Write-Host "Cleaning up temporary files..."
    $ProgressPreference = 'SilentlyContinue'  # Suppress progress bars
    Remove-Item -Path "temp-extract" -Recurse -Force -ErrorAction SilentlyContinue 2>$null | Out-Null
    $ProgressPreference = 'Continue'  # Reset to default
}

Write-Host "===== DEPLOYMENT PROCESS COMPLETED ====="