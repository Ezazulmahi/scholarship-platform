# Software Requirements Specification (SRS)
## Project: ScholarPath (Scholarship Platform)

### 1. Introduction

**1.1 Purpose**
The purpose of this document is to define the software requirements for the **ScholarPath** platform. ScholarPath is a full-stack, AI-powered web application designed to assist students in discovering, matching, and applying for higher education scholarships abroad.

**1.2 Scope**
ScholarPath provides a comprehensive ecosystem for students, featuring user authentication, profile management, a personalized dashboard, and several advanced Artificial Intelligence tools. The AI features include intelligent scholarship matching, a personalized Statement of Purpose (SOP) generator, an interactive conversational advisor, country-specific application guides, and a 4-step cost estimator. 

The architecture is split into three core layers:
1.  **Frontend (Next.js):** A responsive, modern user interface.
2.  **Backend (Node.js/Express):** Core business logic, authentication, and database interactions.
3.  **AI Service (Python/FastAPI):** An isolated microservice utilizing LangChain, RAG (Retrieval-Augmented Generation), and LLM APIs to handle heavy AI-driven tasks.

---

### 2. Overall Description

**2.1 Product Perspective**
The system operates as a unified web platform where the Next.js frontend communicates with both the Express backend (for standard CRUD and Auth operations) and the FastAPI service (for AI generation). 

**2.2 User Characteristics**
The primary users are prospective international students who need guidance, financial aid information, and application assistance for studying abroad.

---

### 3. System Features

#### 3.1 Authentication & User Management
*   **Description:** Secure user access, identity verification, and session management.
*   **Requirements:**
    *   **User Registration:** Users can sign up providing their full name, email, and password.
    *   **OTP Verification:** Accounts must be verified via a 6-digit One-Time Password (OTP) sent to the user's email.
    *   **Secure Login:** Authentication must issue an `HttpOnly` cookie to manage user sessions securely (7-day duration).
    *   **Password Recovery:** Users can request an OTP to reset forgotten passwords.
    *   **Logout:** Users can securely terminate their session.

#### 3.2 User Profile Management
*   **Description:** Centralized storage for user academic and personal details to drive personalized AI features.
*   **Requirements:**
    *   Users can view and update their academic profile.
    *   Supported profile data points include: Name, Current University, Degree, CGPA, IELTS score, GRE score, Field of Study, Target Degree (e.g., Master's), Preferred Countries, Budget Range (e.g., "Fully funded only"), and a Short Bio.
    *   Profile data is heavily utilized as context for all AI endpoints.

#### 3.3 Student Dashboard
*   **Description:** The user's central hub for scholarship search, planning, and application tracking.
*   **Requirements:**
    *   Display a priority checklist and smart profile completion guidance.
    *   Provide a deadline-focused application board tracking upcoming deadlines.
    *   Display high-level metrics (e.g., Open awards, Upcoming deadlines, Average match score).
    *   Fetch and display AI-generated dashboard insights tailored to the user's progress and profile.
    *   Display matched and saved scholarships with quick compare views.

#### 3.4 AI Scholarship Matching (`/scholarships/match`)
*   **Description:** Intelligent recommendation system for scholarships.
*   **Requirements:**
    *   The system must match and rank available scholarships against the user's specific academic profile (CGPA, test scores, field).
    *   Generate a **Match Insight**: An AI-generated explanation detailing exactly why the top scholarship is a good fit for the user based on their data.
    *   Users can also browse all available scholarships within the platform's RAG knowledge base.

#### 3.5 AI SOP (Statement of Purpose) Generator (`/sop/generate`)
*   **Description:** Tool to draft personalized SOPs for specific scholarship applications.
*   **Requirements:**
    *   Generate an SOP tailored to a chosen scholarship and the user's internal profile.
    *   Accept customization inputs: Specific Motivation, Tone (e.g., Academic), and Target Length (e.g., 500, 800, or 1000 words).
    *   Return the generated text along with the exact word count.

#### 3.6 AI Conversational Advisor (`/advisor/chat`)
*   **Description:** A chatbot assistant providing personalized study abroad advice.
*   **Requirements:**
    *   Provide an interactive chat interface that maintains conversation history.
    *   Deliver context-aware responses utilizing the user's profile data to give highly relevant, personalized guidance.

#### 3.7 AI Application Guide (`/apply/guide`)
*   **Description:** Step-by-step roadmap for applying to universities in specific countries.
*   **Requirements:**
    *   Fetch a list of supported countries.
    *   Generate a personalized, step-by-step application guide for a selected country, customized to the user's profile and target degree.

#### 3.8 AI Costing Estimator Flow (`/costing/*`)
*   **Description:** A comprehensive 4-step tool to estimate the total cost of studying abroad.
*   **Requirements:**
    *   **Step 1 (Countries):** Select from supported countries and view cost summaries for visual charts.
    *   **Step 2 (Universities):** Use AI to discover and list universities within the selected country.
    *   **Step 3 (Subjects):** Find English-taught programmes at the selected university.
    *   **Step 4 (Estimate):** Generate a full yearly cost breakdown for a specific programme, factoring in tuition, living expenses, university URLs, and the user's budget.

---

### 4. External Interface Requirements

*   **AI Engine Integration:** The Python FastAPI service integrates with the **Claude API** via **LangChain** for all natural language generation, RAG, and reasoning tasks.
*   **Database Integration:** The Node.js backend utilizes **Supabase** (via `@supabase/supabase-js`) for database interactions.
*   **Email Gateway:** The backend integrates with an email service (configured via Nodemailer and Resend API) to dispatch OTPs for registration and password resets.

---

### 5. Non-Functional Requirements

#### 5.1 Security
*   **Password Hashing:** Passwords must be securely hashed using `bcryptjs` before storage in the database.
*   **Session Management:** Authentication sessions are maintained via secure, `HttpOnly` JSON Web Token (JWT) cookies to mitigate Cross-Site Scripting (XSS) attacks.
*   **CORS Policies:** Cross-Origin Resource Sharing (CORS) must be strictly configured in both the Express backend and FastAPI service to allow only trusted frontend origins.

#### 5.2 Architecture & Reliability
*   **Microservices approach:** The application decouples standard CRUD business logic (Node/Express) from intensive AI processing (Python/FastAPI) to ensure scalability and prevent the main thread from blocking.
*   **RAG Implementation:** To ensure high reliability and minimize AI hallucinations, scholarship information must be retrieved from a grounded vector store/knowledge base before generation.
