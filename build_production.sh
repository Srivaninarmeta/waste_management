#!/bin/bash
set -e

echo "========================================================"
echo "  Building Smart Waste Management Production Release"
echo "========================================================"

echo ""
echo "[1/3] Building React Frontend with Vite..."
cd frontend
npm install
npm run build
cd ..

echo ""
echo "[2/3] Copying Frontend Assets to Spring Boot static resources..."
mkdir -p backend/src/main/resources/static
cp -r frontend/dist/* backend/src/main/resources/static/

echo ""
echo "[3/3] Packaging Spring Boot Fat JAR..."
cd backend
mvn clean package -DskipTests
cd ..

echo ""
echo "========================================================"
echo "  BUILD SUCCESSFUL!"
echo "  Single Executable JAR created at:"
echo "  backend/target/backend-1.0.0.jar"
echo ""
echo "  To run in production:"
echo "  java -jar backend/target/backend-1.0.0.jar"
echo "========================================================"
