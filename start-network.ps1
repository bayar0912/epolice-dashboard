# Цагдаагын дашбоард - Сүлжээний сервер эхлүүлэх
# Network Access Police Dashboard Starter

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   ЦАГДААГЫН ДАШБОАРД СИСТЕМ" -ForegroundColor Yellow
Write-Host "   Police Dashboard System" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# IP хаягийг олох
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"}).IPAddress
if (-not $ipAddress) {
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -ne "127.0.0.1" -and $_.IPAddress -notlike "169.254.*"}).IPAddress | Select-Object -First 1
}

Write-Host "Компьютерийн IP хаяг: " -NoNewline -ForegroundColor White
Write-Host "$ipAddress" -ForegroundColor Green
Write-Host ""

Write-Host "Хандах боломжтой хаягууд:" -ForegroundColor Yellow
Write-Host "  Локал:        http://localhost:3000" -ForegroundColor White
Write-Host "  Сүлжээгээр:   http://$ipAddress`:3000" -ForegroundColor Green
Write-Host ""

# Файрволлын дүрэм шалгах
$firewallRule = Get-NetFirewallRule -DisplayName "Next.js Dev Server" -ErrorAction SilentlyContinue
if (-not $firewallRule) {
    Write-Host "Файрволлын тохиргоо шаардлагатай..." -ForegroundColor Yellow
    try {
        New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction SilentlyContinue
        Write-Host "✓ Файрволлын дүрэм нэмэгдлээ" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Файрволлын дүрэм нэмж чадсангүй. Администратор эрхээр ажиллуулна уу." -ForegroundColor Red
    }
} else {
    Write-Host "✓ Файрволлын тохиргоо хийгдсэн" -ForegroundColor Green
}

Write-Host ""
Write-Host "Сүлжээний серверийг эхлүүлж байна..." -ForegroundColor Cyan
Write-Host ""

# Next.js серверийг сүлжээгээр эхлүүлэх
npm run dev:network
