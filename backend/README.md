# ⚙️ Smart Waste Management - Backend REST API

The core enterprise backend service for the **Smart Waste Management and Pickup System**, built with **Spring Boot 3.3.4**, **Java 21**, and **MySQL 8.0**.

---

## 🌐 Live Service & API Docs
- **🚀 Live Backend REST API:** [https://waste-management-cxsv.onrender.com](https://waste-management-cxsv.onrender.com)
- **📖 Live Swagger / OpenAPI Documentation:** [https://waste-management-cxsv.onrender.com/swagger-ui/index.html](https://waste-management-cxsv.onrender.com/swagger-ui/index.html)
- **🖥️ Frontend Web Portal:** [https://smart-waste-liard.vercel.app](https://smart-waste-liard.vercel.app)
- **📁 Frontend Repository:** [https://github.com/Srivaninarmeta/waste_management_frontend](https://github.com/Srivaninarmeta/waste_management_frontend)

---

## 🌟 Architecture & Features
- **Stateless Authentication:** Spring Security 6 with HS256 JWT tokens and `@PreAuthorize` role-based access control (ADMIN, RESIDENT, WORKER).
- **Data Integrity & Auditing:** Spring Data JPA with `@Transactional` boundaries recording status transitions to `pickup_status_histories`.
- **Automated Seeder:** Pre-populates demo accounts on first launch for effortless testing.
- **REST APIs:** Fully documented with Swagger / OpenAPI 3.

---

## 🛠️ Tech Stack
- **Framework:** Spring Boot 3.3.4 (Web, Data JPA, Security, Validation)
- **Language:** Java 21 (Temurin LTS)
- **Database:** MySQL 8.0 / Cloud TiDB
- **Build Tool:** Maven 3.9
- **Deployment:** Render (Docker container)

---

## 🚀 Getting Started Locally

```bash
mvn spring-boot:run
```
Runs at `http://localhost:8080`.
