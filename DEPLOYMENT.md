# 🌐 Deployment Guide: Smart Waste Management and Pickup System

This guide outlines multiple deployment methods suitable for local production, containerized servers, and 100% free cloud hosting platforms.

---

## 📋 Table of Contents
1. [Option 1: Single Fat JAR (Simplest & Best for College Demo)](#option-1-single-fat-jar)
2. [Option 2: Docker & Docker Compose (Production Server / VPS)](#option-2-docker--docker-compose)
3. [Option 3: Free Cloud Deployment (Render + TiDB/Aiven + Vercel)](#option-3-free-cloud-deployment)
4. [Environment Variables Reference](#environment-variables-reference)

---

## Option 1: Single Fat JAR

The React frontend has been bundled directly inside the Spring Boot executable JAR (`backend-1.0.0.jar`). 
Running this single JAR serves both the **React Web UI** and the **Spring Boot REST APIs** from a single port (`8080`) with zero CORS complications.

### 1. Build the Unified Bundle
On Windows:
```cmd
build_production.bat
```
Or manually:
```cmd
cd frontend
npm run build
cd ..
xcopy /E /I /Y "frontend\dist\*" "backend\src\main\resources\static\"
cd backend
mvn clean package -DskipTests
```

### 2. Run the Application
Make sure your MySQL server is running, then execute:
```cmd
java -jar backend\target\backend-1.0.0.jar
```

### 3. Access the Application
- **Web Application:** [http://localhost:8080](http://localhost:8080)
- **Swagger API Docs:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **API Base:** [http://localhost:8080/api](http://localhost:8080/api)

---

## Option 2: Docker & Docker Compose

Deploy the entire 3-tier architecture with a single command on any machine with Docker installed (Ubuntu, AWS EC2, DigitalOcean droplet, Windows with Docker Desktop).

### Architecture
- **MySQL Container:** MySQL 8.0 with automatic healthcheck & persistent database storage
- **Backend Container:** Eclipse Temurin Java 21 JRE, Spring Boot service
- **Frontend Container:** Nginx Alpine reverse proxying `/api` to backend and serving React assets

### Run Command
In the root directory:
```bash
docker compose up -d --build
```

### Stop Command
```bash
docker compose down
```

### Access
- **Web UI:** [http://localhost](http://localhost) (Port 80)
- **Backend Direct:** [http://localhost:8080](http://localhost:8080)

---

## Option 3: Free Cloud Deployment

You can host this entire system online for free without a credit card using:
1. **Database:** [TiDB Cloud (Serverless)](https://tidbcloud.com) or [Aiven](https://aiven.io) (Free 5GB MySQL)
2. **Backend:** [Render](https://render.com) (Free Web Service)
3. **Frontend:** [Vercel](https://vercel.com) or Render Static Site

### Step 1: Create Free Cloud MySQL
1. Sign up at [Aiven.io](https://aiven.io) or [TiDB Cloud](https://tidbcloud.com).
2. Create a free MySQL instance.
3. Import `database/schema.sql` and `database/seed_data.sql` via their web console or DBeaver.
4. Note your JDBC connection URL, Username, and Password.

### Step 2: Deploy Backend on Render
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New + Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory:** `backend`
   - **Runtime:** `Docker` (or Java)
   - **Dockerfile Path:** `Dockerfile`
5. Add Environment Variables:
   - `DB_URL`: `jdbc:mysql://<host>:<port>/<database>?useSSL=true&serverTimezone=UTC`
   - `DB_USERNAME`: `<your_db_username>`
   - `DB_PASSWORD`: `<your_db_password>`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-app.vercel.app`
6. Click **Deploy Web Service**. You will receive an address like `https://smartwaste-backend.onrender.com`.

### Step 3: Deploy Frontend on Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
3. Edit `frontend/vercel.json` to point `/api` destination to your Render backend URL:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://smartwaste-backend.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
4. Click **Deploy**. Your application is live globally with SSL!

---

## ⚙️ Environment Variables Reference

| Variable | Default Value | Description |
|---|---|---|
| `server.port` / `PORT` | `8080` | Port for Spring Boot |
| `DB_URL` | `jdbc:mysql://localhost:3306/waste_management_db` | MySQL JDBC Connection string |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | `srivani` | Database password |
| `JWT_SECRET` | 64-char hex key | Secret key for HS256 JWT tokens |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | Token validity in milliseconds |
| `CORS_ALLOWED_ORIGINS`| `http://localhost:5173,...` | Comma-separated allowed frontend origins |
| `APP_SEED_ENABLED` | `true` | Auto-seed demo accounts on startup |
