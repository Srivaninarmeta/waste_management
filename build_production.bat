@echo off
echo ========================================================
echo   Building Smart Waste Management Production Release
echo ========================================================

echo.
echo [1/3] Building React Frontend with Vite...
cd frontend
call npm install
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error: Frontend build failed!
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo [2/3] Copying Frontend Assets to Spring Boot static resources...
if not exist "backend\src\main\resources\static" mkdir "backend\src\main\resources\static"
xcopy /E /I /Y "frontend\dist\*" "backend\src\main\resources\static\"

echo.
echo [3/3] Packaging Spring Boot Fat JAR...
cd backend
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error: Backend package failed!
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo ========================================================
echo   BUILD SUCCESSFUL!
echo   Single Executable JAR created at:
echo   backend\target\backend-1.0.0.jar
echo.
echo   To run in production:
echo   java -jar backend\target\backend-1.0.0.jar
echo ========================================================
pause
