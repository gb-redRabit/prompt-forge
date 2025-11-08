# PWA Test Script
# Sprawdza czy PWA jest poprawnie skonfigurowane

Write-Host "Sprawdzanie konfiguracji PWA..." -ForegroundColor Cyan
Write-Host ""

# Check if @vite-pwa/nuxt is installed
Write-Host "1. Sprawdzanie instalacji @vite-pwa/nuxt..." -ForegroundColor Yellow
if (Test-Path "node_modules/@vite-pwa") {
    Write-Host "   [OK] @vite-pwa/nuxt zainstalowane" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] @vite-pwa/nuxt NIE jest zainstalowane" -ForegroundColor Red
    Write-Host "   Uruchom: npm install @vite-pwa/nuxt" -ForegroundColor Yellow
    exit 1
}

# Check if icons exist
Write-Host ""
Write-Host "2. Sprawdzanie ikon PWA..." -ForegroundColor Yellow
$icons = @("icon-64x64.png", "icon-192x192.png", "icon-512x512.png")
$missingIcons = @()

foreach ($icon in $icons) {
    $path = "public/$icon"
    if (Test-Path $path) {
        Write-Host "   [OK] $icon istnieje" -ForegroundColor Green
    } else {
        Write-Host "   [MISS] $icon BRAKUJE" -ForegroundColor Red
        $missingIcons += $icon
    }
}

if ($missingIcons.Count -gt 0) {
    Write-Host ""
    Write-Host "   [WARN] Brakujace ikony:" -ForegroundColor Yellow
    Write-Host "   Otworz: scripts/generate-pwa-icons.html" -ForegroundColor Cyan
    Write-Host "   Wygeneruj i zapisz w folderze public/" -ForegroundColor Cyan
}

# Check nuxt.config.ts for pwa configuration
Write-Host ""
Write-Host "3. Sprawdzanie nuxt.config.ts..." -ForegroundColor Yellow
$config = Get-Content "nuxt.config.ts" -Raw
if ($config -match "pwa:") {
    Write-Host "   [OK] Konfiguracja PWA znaleziona" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Brak konfiguracji PWA" -ForegroundColor Red
    exit 1
}

# Check if @vite-pwa/nuxt is in modules
if ($config -match "@vite-pwa/nuxt") {
    Write-Host "   [OK] Modul PWA dodany do nuxt.config" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Modul PWA NIE jest dodany do modules[]" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PODSUMOWANIE:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($missingIcons.Count -eq 0) {
    Write-Host "[SUCCESS] PWA jest w pelni skonfigurowane!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nastepne kroki:" -ForegroundColor Yellow
    Write-Host "   1. npm run dev     - Test w development" -ForegroundColor Cyan
    Write-Host "   2. npm run build   - Build production" -ForegroundColor Cyan
    Write-Host "   3. npm run preview - Test production build" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Test instalacji PWA:" -ForegroundColor Yellow
    Write-Host "   - Otworz w Chrome/Edge" -ForegroundColor Cyan
    Write-Host "   - Kliknij ikone '+' w pasku adresu" -ForegroundColor Cyan
    Write-Host "   - 'Zainstaluj aplikacje'" -ForegroundColor Cyan
} else {
    Write-Host "[WARN] PWA prawie gotowe - brakuje ikon!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "TODO:" -ForegroundColor Yellow
    Write-Host "   1. Otworz: scripts/generate-pwa-icons.html" -ForegroundColor Cyan
    Write-Host "   2. Pobierz wygenerowane ikony" -ForegroundColor Cyan
    Write-Host "   3. Zapisz w folderze public/" -ForegroundColor Cyan
    Write-Host "   4. Uruchom ponownie ten script" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
