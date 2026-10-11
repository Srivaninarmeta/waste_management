# 🎓 Smart Waste Management System: Demonstration & Viva Defense Guide

This guide is designed to help you confidently present and demonstrate the **Smart Waste Management and Pickup System** during your project presentation, review, or viva examination.

---

## 📌 1. Project Overview (The 60-Second Elevator Pitch)

> *"Good morning/afternoon. Today I am presenting the **Smart Waste Management and Pickup System**, a full-stack enterprise web platform designed to solve urban waste collection inefficiencies by connecting **Residents**, **Sanitation Workers**, and **Municipal Administrators** into a transparent, real-time workflow.*
>
> *Urban waste management often suffers from irregular pickup schedules, lack of accountability, and communication gaps between residents and sanitation teams. Our system eliminates these issues by providing a role-based portal where residents request pickups across 6 waste categories, administrators allocate resources and monitor operations, and workers accept and execute collections with real-time status auditing."*

---

## 🏗️ 2. System Architecture & Tech Stack

```mermaid
graph TD
    subgraph Client Tier
        UI["React 19 SPA (Vite + Bootstrap 5)"]
    end

    subgraph Security & Gateway Tier
        CORS["CORS Filter"]
        JWT["JWT Auth Filter (Spring Security 6)"]
    end

    subgraph Business Tier
        AC["AdminController"]
        RC["Resident PickupRequestController"]
        WC["WorkerController"]
        AS["AdminService"]
        PS["PickupRequestService"]
        WS["WorkerService"]
    end

    subgraph Data Tier
        REPO["Spring Data JPA Repositories"]
        DB[("MySQL 8.0 Relational DB")]
    end

    UI -->|HTTP / REST (JSON)| CORS
    CORS --> JWT
    JWT --> AC
    JWT --> RC
    JWT --> WC
    AC --> AS
    RC --> PS
    WC --> WS
    AS --> REPO
    PS --> REPO
    WS --> REPO
    REPO -->|Hibernate ORM| DB
```

| Component | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19, Vite, Bootstrap 5 | Component reusability, lightning-fast HMR builds, responsive mobile/desktop UI |
| **Backend** | Spring Boot 3.3.4, Java 21 | High performance, robust enterprise architecture, dependency injection |
| **Security** | Spring Security 6, JJWT | Stateless authentication, stateless JWT bearer tokens, `@PreAuthorize` RBAC |
| **Persistence**| Spring Data JPA, Hibernate | Clean repository pattern, automated query generation, transactional integrity |
| **Database** | MySQL 8.0 | ACID compliance, referential integrity with foreign key cascading |

---

## 🕒 3. Minute-by-Minute Live Demo Script

Follow these steps in your browser at **`http://localhost:5173`** (or `http://localhost:8080` in single JAR mode):

### ⏱️ Minute 1: Resident Submits a Request
1. Open [http://localhost:5173/login](http://localhost:5173/login).
2. Click the green **"Fill Resident"** button (`resident@waste.com` / `resident123`).
3. Click **"Sign In"**. You are redirected to the **Resident Dashboard**.
4. Point out:
   - **Recent Requests Table** and Quick Summary Cards.
   - Click **"New Pickup Request"** button.
5. Fill out a new request:
   - **Waste Category:** Select *Recyclable* or *E-Waste*.
   - **Pickup Address:** `102 Green Park Avenue`.
   - **Locality:** `North Zone`.
   - **Preferred Date:** Select a future date.
   - **Notes:** *"Old computers and plastic packaging."*
6. Click **"Submit Request"**.
7. Point out the newly generated Request Code (`REQ-YYYYMMDD-XXXX`) and initial state: `PENDING`.

---

### ⏱️ Minute 2: Administrator Reviews & Assigns Task
1. Log out or open an Incognito window at [http://localhost:5173/login](http://localhost:5173/login).
2. Click **"Fill Admin"** (`admin@waste.com` / `admin123`) and log in.
3. Show the **Executive Dashboard**:
   - Total requests, pending requests, active workers, completion rate.
4. Navigate to **"Pickup Requests"**:
   - Notice the newly created resident request with status `PENDING`.
   - Click **"Assign Worker"**.
   - Select sanitation worker **David Miller** from the active worker dropdown.
   - Click **"Confirm Assignment"**.
5. Observe that the status immediately updates to `ASSIGNED`.

---

### ⏱️ Minute 3: Sanitation Worker Executes Pickup
1. Log out and click **"Fill Worker"** (`worker@waste.com` / `worker123`).
2. Show the **Worker Portal**:
   - Worker sees their personalized task queue with locality, category, and resident instructions.
3. Click **"Accept Task"**:
   - Status updates from `ASSIGNED` ➔ `ACCEPTED`.
4. Click **"Start Collection"**:
   - Status updates to `IN_PROGRESS` (signals collection truck is en route).
5. Click **"Mark as Collected"**:
   - Enter completion notes: *"Waste picked up and weighed: 14.5 kg."*
   - Status transitions to `COLLECTED`.

---

### ⏱️ Minute 4: Transparent Audit Trail & Reports
1. Log back in as **Resident** (`resident@waste.com`).
2. Click on the request details to view the **Audit Timeline**:
   - Show the step-by-step audit history containing the user, exact timestamp, and notes for each transition:
     - `PENDING` (Resident)
     - `ASSIGNED` (Admin)
     - `ACCEPTED` (Worker)
     - `IN_PROGRESS` (Worker)
     - `COLLECTED` (Worker)
3. Switch back to **Admin**:
   - View **"Reports & Analytics"** to show that completed metrics updated in real-time.

---

## 🎯 4. Top Viva Questions & Model Answers

### Q1: Why did you choose JWT instead of traditional HTTP Session?
> **Answer:** *"HTTP sessions are stateful, requiring the server to store session data in memory. This creates scalability bottlenecks when distributing requests across multiple backend instances. JWT is stateless—the token is signed cryptographically on the server and sent in the Authorization header. Any server instance possessing the secret key can verify the token without querying a central session cache."*

### Q2: How does your system ensure Role-Based Access Control (RBAC)?
> **Answer:** *"We implement a defense-in-depth model with two layers:*
> 1. *URL-level security in `SecurityConfig.java` restricting route prefixes (e.g. `/api/admin/**` requires `ROLE_ADMIN`, `/api/worker/**` requires `ROLE_WORKER`).*
> 2. *Method-level security using `@PreAuthorize("hasRole('ADMIN')")` on controllers and services to prevent privilege escalation even if endpoint paths change."*

### Q3: How is data integrity guaranteed during status transitions?
> **Answer:** *"All state transitions are wrapped in Spring's `@Transactional` boundary in `PickupRequestService` and `WorkerService`. When a status changes, two database operations happen atomically: updating the `PickupRequest` record and creating an entry in the `StatusHistory` table. If either operation fails, the transaction rolls back, preventing inconsistent records."*

### Q4: How is password security handled?
> **Answer:** *"Passwords are never stored in plaintext. We utilize Spring Security's `BCryptPasswordEncoder`, which incorporates a high work factor (adaptive cost) and an automatic 16-byte random cryptographic salt. This protects against rainbow table lookups and brute-force attacks."*

### Q5: How do you handle Cross-Origin Resource Sharing (CORS)?
> **Answer:** *"We configured a dedicated `CorsConfigurationSource` bean in Spring Boot that explicitly whitelists the Vite client origins (`http://localhost:5173`) and allows standard HTTP methods (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`). For single-JAR production mode, the React bundle is served directly from Spring Boot's static folder, eliminating CORS entirely."*

### Q6: What happens if a worker tries to update a task assigned to another worker?
> **Answer:** *"In `WorkerService.updateTaskStatus()`, we verify that the authenticated `UserPrincipal.getId()` matches the `assignedWorker.getId()` on the `PickupRequest`. If it does not match, a custom `AccessDeniedException` or validation error is thrown with HTTP 403 Forbidden."*

---

## 📊 5. Database Schema Reference

```sql
-- Core Relational Tables
USERS (id, email, password, full_name, phone_number, role, locality, active, created_at, updated_at)
PICKUP_REQUESTS (id, request_number, resident_id, worker_id, waste_category, pickup_address, locality, preferred_pickup_date, status, resident_instructions, worker_notes, created_at, updated_at, assigned_at, collected_at)
STATUS_HISTORIES (id, request_id, previous_status, new_status, changed_by_user_id, remarks, created_at)
```
