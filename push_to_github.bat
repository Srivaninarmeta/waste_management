@echo off
set "PATH=%PATH%;%LOCALAPPDATA%\MinGit\cmd"
echo ========================================================
echo   Pushing Smart Waste Management to GitHub
echo   Repository: https://github.com/Srivaninarmeta/waste_management.git
echo ========================================================
echo.
git push -u origin main
echo.
pause
