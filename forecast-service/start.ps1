# Start Forecast Service
# Run this to start the microservice

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Forecast Service - Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Change to the service directory
Set-Location "D:\Projects\Coding\BSEntrepSystem\forecast-service"

# Get Python from venv
$pythonExe = ".\venv\Scripts\python.exe"

Write-Host "`nStarting uvicorn server..." -ForegroundColor Yellow
Write-Host "URL: http://localhost:8001" -ForegroundColor Green
Write-Host "Docs: http://localhost:8001/docs" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop`n" -ForegroundColor Yellow

& "$pythonExe" -m uvicorn app:app --host 0.0.0.0 --port 8001
