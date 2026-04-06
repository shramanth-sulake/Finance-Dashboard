# 🚀 Zorvyn Financial Dashboard

An enterprise-grade financial management platform built with a focus on security, scalability, and clean architectural patterns.

## 🏗 Architectural Overview: 3-Tier Design

The backend implements a decoupled **Controller-Service-Repository** pattern. This separation of concerns ensures that business logic, data access, and API orchestration remain isolated, making the system highly maintainable and testable.

### The Layers
* **Presentation Tier (React):** A headless UI approach where the frontend manages state and routing with zero knowledge of database schemas.
* **Business Logic Tier (Express):** Manages API orchestration, security enforcement (JWT), and payload validation.
* **Data Access Tier (Repositories):** The exclusive gateway to the SQLite database. This abstraction allows for seamless migration to PostgreSQL or MySQL with minimal code changes.

---

## 🛠 Technical Implementations

### 🔐 Advanced Security
* **Defensive Headers:** Utilizes **Helmet.js** to mitigate common vulnerabilities such as Clickjacking, XSS, and MIME-sniffing.
* **Traffic Governance:** Integrated **Express-Rate-Limit** to prevent Brute-Force attacks and act as a buffer against DDoS attempts.
* **Authentication:** Robust JWT-based authentication flow protecting sensitive financial endpoints.

### 🔍 Reliability & Validation
* **Schema Enforcement:** Implementation of **Zod Interceptors**. Requests are validated against strict schemas before hitting controllers, ensuring data integrity and providing automatic `400 Bad Request` feedback.
* **Automated Testing:** A comprehensive suite using **Jest** and **Supertest** to validate API boundary conditions and failure states without requiring a live server environment.

### 📈 Performance & Scalability
* **Optimized Queries:** Database-level **Indexing** on high-traffic columns (`date`, `category`) ensures high-speed lookups during complex aggregations.
* **Memory Management:** Implemented **LIMIT/OFFSET Pagination** at the repository level, preventing memory overflows by streaming data in manageable chunks.

### 🐳 DevOps & DX
* **Containerization:** Multi-stage **Docker** builds using `node:alpine` for a lightweight footprint.
* **Orchestration:** `docker-compose` integration for one-command deployments with persistent volume mapping.
* **API Documentation:** Integrated **Swagger UI** (OpenAPI) accessible at `/api-docs` for interactive endpoint testing.

---

## ⚡ Refactoring & Code Quality

The project underwent a rigorous transition from a prototype to an enterprise-standard codebase:

* **Immutable Logic:** Replaced loose variable declarations with strict `const` bindings to prevent side effects.
* **Type Safety:** 100% TypeScript coverage with rigorous interface definitions (e.g., `RecordItem`, `SummaryData`) across the entire stack.
* **Clean Code:** Purged all telemetry/debug logs in favor of centralized error-handling middleware.
* **Standardization:** Implemented **JSDoc** for all function signatures to provide rich IntelliSense support.

---

## 🚀 Getting Started

1. **Clone the repo:** ```bash
   git clone [https://github.com/your-username/zorvyn-dashboard.git](https://github.com/your-username/zorvyn-dashboard.git)