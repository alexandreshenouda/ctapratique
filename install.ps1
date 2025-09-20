# PowerShell installation script for Stephane App
Write-Host "Setting up Stephane App..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Yellow
} catch {
    Write-Host "npm is not available. Please ensure Node.js is properly installed." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the app:" -ForegroundColor Cyan
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "Platform-specific commands:" -ForegroundColor Cyan
    Write-Host "  npm run web     # Run in web browser" -ForegroundColor White
    Write-Host "  npm run android # Run on Android" -ForegroundColor White
    Write-Host "  npm run ios     # Run on iOS" -ForegroundColor White
    Write-Host ""
    Write-Host "Make sure to install Expo CLI globally if you haven't:" -ForegroundColor Yellow
    Write-Host "  npm install -g @expo/cli" -ForegroundColor White
} else {
    Write-Host "Failed to install dependencies. Please check the error messages above." -ForegroundColor Red
    exit 1
}
