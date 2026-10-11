@echo off
set "PATH=%PATH%;%LOCALAPPDATA%\MinGit\cmd"
echo =========================================================================
echo   Pushing to Separate GitHub Repositories
echo =========================================================================
echo.
echo Make sure you have created these two empty repositories on GitHub:
echo   1. https://github.com/Srivaninarmeta/waste_management_backend
echo   2. https://github.com/Srivaninarmeta/waste_management_frontend
echo.
pause

echo.
echo [1/2] Pushing Backend to waste_management_backend...
git push https://github.com/Srivaninarmeta/waste_management_backend.git backend-branch:main

echo.
echo [2/2] Pushing Frontend to waste_management_frontend...
git push https://github.com/Srivaninarmeta/waste_management_frontend.git frontend-branch:main

echo.
echo =========================================================================
echo   PUSH COMPLETE!
echo   Backend Repo:  https://github.com/Srivaninarmeta/waste_management_backend
echo   Frontend Repo: https://github.com/Srivaninarmeta/waste_management_frontend
echo =========================================================================
pause
