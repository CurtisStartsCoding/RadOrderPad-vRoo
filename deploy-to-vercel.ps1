# Simple Vercel Deployment Script
Write-Host "===== DEPLOYING TO VERCEL ====="

# Check if vercel-deploy directory exists
if (-not (Test-Path "vercel-deploy")) {
    Write-Host "Error: vercel-deploy directory not found."
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
    Push-Location -Path "vercel-deploy"
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
}

Write-Host "===== DEPLOYMENT PROCESS COMPLETED ====="