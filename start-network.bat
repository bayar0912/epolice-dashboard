@echo off
chcp 65001 >nul
echo ==================================
echo    ЦАГДААГЫН ДАШБОАРД СИСТЕМ
echo    Police Dashboard System
echo ==================================
echo.

REM IP хаягийг олох
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        if not "%%b"=="127.0.0.1" (
            set LOCAL_IP=%%b
            goto :found_ip
        )
    )
)
:found_ip

echo Компьютерийн IP хаяг: %LOCAL_IP%
echo.
echo Хандах боломжтой хаягууд:
echo   Локал:        http://localhost:3000
echo   Сүлжээгээр:   http://%LOCAL_IP%:3000
echo.

echo Сүлжээний серверийг эхлүүлж байна...
echo.

REM Next.js серверийг сүлжээгээр эхлүүлэх
call npm run dev:network

pause
