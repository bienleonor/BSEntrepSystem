# Start Forecast Service
# Run this to start the microservice

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Forecast Service - Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Activate virtual environment and start server
$venvPath = "D:/Projects/Coding/BSEntrepSystem/TRY/BSEntrepSystem/forecast-service/venv/Scripts"

Write-Host "`nStarting uvicorn server..." -ForegroundColor Yellow
Write-Host "URL: http://localhost:8000" -ForegroundColor Green
Write-Host "Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop`n" -ForegroundColor Yellow

& "$venvPath/uvicorn.exe" app:app --reload --host 0.0.0.0 --port 8000
