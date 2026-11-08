# Eligify – Smart Government Welfare Scheme Eligibility Platform

<p align="center">
  <strong>Making Government Welfare Schemes Accessible to Everyone 🇮🇳</strong>
</p>

Eligify is a privacy-focused welfare eligibility platform designed to help Indian citizens discover government welfare schemes they may qualify for based on their personal, demographic, and socio-economic information.

Instead of manually searching through multiple government portals and complex eligibility guidelines, Eligify evaluates a citizen's profile against a structured catalog of **3,400+ Central and State Government welfare schemes** and presents relevant opportunities with eligibility details, benefits, and official application links.

---

## 🚀 Key Features

### 1. Smart Scheme Eligibility Detection
- Evaluates user profiles against 3,400+ government welfare schemes.
- Uses a deterministic, rule-based eligibility engine.
- Checks age, income, gender, state, social category, landholding, and other eligibility conditions.
- Displays reasons when a citizen does not qualify.

### 2. Government Scheme Discovery
- Central and State Government welfare scheme catalog.
- Scheme search and category-based filtering.
- Detailed scheme information and benefits.
- Direct links to official government application portals.

### 3. Document Verification Using OCR
- Uses Tesseract.js for client-side Optical Character Recognition (OCR).
- Extracts relevant information from uploaded documents.
- Supports extraction from income certificates, ration cards, caste certificates, Aadhaar documents, and land records.
- Allows users to review and correct extracted information.

### 4. Privacy-Focused Authentication and Data Protection
- Zero-knowledge authentication architecture.
- PBKDF2-based key derivation and AES-256-GCM encryption.
- Encrypted IndexedDB storage for sensitive profile data.
- In-memory session management.
- Automatic vault locking after inactivity.
- Account isolation to prevent cross-user data access.

### 5. Secure Backend and Database
- REST API architecture.
- SQLite-based scheme catalog.
- PostgreSQL Row-Level Security (RLS) for user data isolation.
- Secure API response headers and caching controls.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 18, JavaScript (ES6+) |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Backend | Node.js |
| API | REST API |
| Database | SQLite, PostgreSQL |
| OCR | Tesseract.js |
| Authentication | Web Crypto API |
| Encryption | PBKDF2, HKDF, AES-256-GCM |
| Storage | IndexedDB |
| Testing | Node.js Test Scripts |
| Version Control | Git, GitHub |

---

## 🏗️ System Architecture

Eligify follows a client-server architecture with a privacy-focused frontend and a backend eligibility evaluation system.

```text
                 USER
                   |
                   v
          React Frontend (UI)
                   |
          +--------+---------+
          |                  |
          v                  v
    Authentication      Document Upload
          |                  |
          v                  v
    Encrypted Vault     Tesseract.js OCR
          |                  |
          |                  v
          |           Profile Extraction
          |                  |
          +--------+---------+
                   |
                   v
           Profile Verification
                   |
                   v
              REST API
                   |
                   v
          Eligibility Engine
                   |
                   v
          Scheme Database
                   |
                   v
       Eligibility Evaluation
                   |
                   v
        Matching Schemes
                   |
                   v
       Benefits & Official Links
```

---

## ⚙️ How Eligify Works

1. **User Registration:** The citizen creates an account and authenticates securely.
2. **Profile Creation:** The user enters demographic and socio-economic details.
3. **Document Processing:** Users can upload supporting documents for client-side OCR extraction.
4. **Profile Verification:** Extracted information is displayed for review and correction.
5. **Eligibility Evaluation:** The backend evaluates the verified profile against scheme-specific rules.
6. **Results Generation:** Eligible schemes, benefits, and application links are displayed.
7. **Application:** Citizens can visit the respective official government portals to apply.

---

## 💻 Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js (22 or later recommended)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ShwetaRana29/Eligify.git
```

### 2. Navigate to the Project Directory

```bash
cd Eligify
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Backend Server

Open a terminal and execute:

```bash
npm run server
```

The backend server starts on port `5000`.

### 5. Start the Frontend

Open another terminal in the project directory:

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

Open the URL in your browser to access Eligify.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend health check |
| GET | `/api/schemes` | Retrieve and search schemes |
| GET | `/api/schemes/:id` | Retrieve scheme details |
| POST | `/api/evaluate` | Evaluate user eligibility |
| GET | `/api/categories` | Retrieve scheme categories |

---

## 🧪 Running Tests

Eligify includes automated tests for its major system components.

Run the following commands individually:

```bash
# Eligibility rule engine tests
npm run test:rules

# Encryption and authentication vault tests
npm run test:vault

# Document extraction tests
npm run test:extraction

# User isolation and security tests
npm run test:isolation
```

---

## 🔐 Security and Privacy

Privacy is an important part of Eligify's architecture.

The project incorporates:

- Client-side document processing.
- AES-256-GCM authenticated encryption.
- PBKDF2 and HKDF-based key derivation.
- Encrypted local data storage.
- In-memory session management.
- Automatic session locking.
- PostgreSQL Row-Level Security.
- Protection against cross-account data access.

These are implemented security measures and design goals; they should not be interpreted as independent security certification or legal compliance verification.

---

## 📂 Project Documentation

For a deeper understanding of the application's architecture, implementation, database design, security mechanisms, and testing approach, refer to:

- [Architecture and Working Documentation](ARCHITECTURE_AND_WORKING_DOCUMENTATION.md)
- [Architecture HTML Document](ARCHITECTURE_DOCUMENT.html)
- [Detailed Architecture Report (PDF)](Eligify_Architecture_and_Working_Report.pdf)
- [Security Documentation](README_SECURITY.md)

---

## 🎯 Project Objective

The primary objective of Eligify is to reduce the information gap between government welfare programs and the citizens who need them.

By simplifying eligibility discovery, automating rule-based evaluation, and prioritizing data privacy, Eligify aims to make welfare scheme information easier to access and understand.

---

## 🔮 Future Enhancements

- Multilingual support for regional Indian languages.
- Integration with more official government data sources.
- Improved document extraction accuracy.
- Notifications for newly introduced welfare schemes.
- Expanded scheme coverage and automated data updates.
- Accessibility improvements for rural and first-time internet users.

---

## 👩‍💻 Developer

**Shweta Rana**

B.Tech – Computer Science and Engineering

- GitHub: [@ShwetaRana29](https://github.com/ShwetaRana29)
- LinkedIn: [Shweta Rana](https://www.linkedin.com/in/shweta-rana-baa374290/)

---

<p align="center">
  <strong>Eligify – Bridging the Gap Between Citizens and Government Welfare Schemes 🇮🇳</strong>
</p>
