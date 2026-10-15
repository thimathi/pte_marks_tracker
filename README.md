# 🚀 PTE Academic 21-Day Progress Tracker & Scoring Engine

A production-ready, full-stack responsive web application designed for high-intensity PTE Academic preparation (Target 79+ / 90). Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Firebase (Authentication & Realtime Database)**.

Deployed to Firebase Hosting: [https://ptemarkstracking.web.app](https://ptemarkstracking.web.app)

---

## 📋 Table of Contents
1. [Core Features & Architecture](#core-features--architecture)
2. [Target Progression & 21-Day Journey](#target-progression--21-day-journey)
3. [Mixed Practice (Interleaving Engine)](#mixed-practice-interleaving-engine)
4. [Mandatory Rollover & 7-Item Gate Lock](#mandatory-rollover--7-item-gate-lock)
5. [Prerequisites](#prerequisites)
6. [Installation & Local Setup](#installation--local-setup)
7. [Environment Variables](#environment-variables)
8. [Firebase Setup & Authentication](#firebase-setup--authentication)
9. [Database Architecture & Security Rules](#database-architecture--security-rules)
10. [Running Unit Tests](#running-unit-tests)
11. [Production Build & Firebase Deployment](#production-build--firebase-deployment)
12. [Legacy Data Migration](#legacy-data-migration)
13. [CSV Export & Reporting](#csv-export--reporting)
14. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🌟 Core Features & Architecture

- **21 Planned Study Days:** Day 1 through Day 21 with configurable start date (Default: `11 October 2026`).
- **4,200 Total Practice Questions:** Exactly 200 questions / day across 16 official PTE Academic question types.
- **42 Planned Mock Exams:** Exactly 2 high-intensity simulation exams per day (60 Qs per mock), each with its own deep review workflow.
- **Deterministic Mixed Practice Queue:** Balanced Weighted Fair Queueing (Deficit Round Robin) that interleaves Speaking, Writing, Reading, and Listening. No monotonous blocks.
- **5-Question Phase Tracking:** Supports decimal scores (0–90), phase averages, and question counts omitting blank scores.
- **Mandatory Completion Gate & Strict Rollover:** Day $N+1$ remains locked until Day $N$ satisfies all 7 completion requirements. Unfinished tasks carry forward as rolled-over items; calendar date changes never bypass incomplete work.
- **Weakness Diagnostics:** Real-time identification of weakest skill and targeted prediction module recommendations.
- **Full Review Center:** Tracks low-scoring (<65) and flagged questions, requiring corrective actions and review notes.
- **Final 21-Day Report & Print to PDF:** Executive summary with planned vs. completed targets, net mock improvement, skill breakdown, and lessons learned.
- **Dual CSV Export:** Practice attempts and 42 Mock simulation records downloadable anytime.
- **Secure Firebase Auth & Realtime Database:** Scoped strictly to authenticated UID (`/users/{uid}`). No client-side admin keys or backend server dependencies.

---

## 🎯 Target Progression & 21-Day Journey

The study plan progresses from an entry score of 62+ to 85+:

| Days | Benchmark Target | Daily Practice | Planned Mocks | Daily Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Day 1 – 3** | **62+ – 64+** | 200 Qs | Mock 1 & 2 | Baseline rhythm, Read Aloud & Repeat Sentence |
| **Day 4 – 7** | **66+ – 71+** | 200 Qs | Mock 7 & 8 | Prediction R/W FIB & Write From Dictation drills |
| **Day 8 – 14** | **72+ – 79+** | 200 Qs | Mock 15 & 28 | 79+ threshold mastery, speed typing templates |
| **Day 15 – 21** | **80+ – 85+** | 200 Qs | Mock 29 & 42 | High-precision fluency, collocations, final audit |

---

## 🔀 Mixed Practice (Interleaving Engine)

Rather than monolithic practice blocks (all Speaking, then all Writing...), the application uses a **Weighted Fair Queueing (WFQ)** algorithm with deterministic seeding:

1. **Reconciled Daily Breakdown (Exactly 200 Questions):**
   - **Speaking (80 Qs):** Read Aloud (20, Prediction 🔥), Repeat Sentence (30, Prediction 🔥), Describe Image (8), Retell Lecture (6), Respond to Situation (6), Summarize Group Discussion (5), Answer Short Questions (5).
   - **Writing (15 Qs):** Summarize Written Text (10), Write Essay (5).
   - **Reading (55 Qs):** R/W Fill in Blanks (25, Prediction 🔥), Reading Fill in Blanks (20), Reorder Paragraphs (10).
   - **Listening (50 Qs):** Write From Dictation (25, Prediction 🔥), Listening FIB (12), Highlight Incorrect Words (8), Summarize Spoken Text (5).
2. **Uniform Distribution:** Higher frequency question types (e.g. Repeat Sentence: 30 instances) appear roughly every 6.6 questions, preventing clustering or end-of-session fatigue.
3. **Session Resumption:** Queue index is saved locally and in Firebase, allowing uninterrupted resumption across browser refreshes.

---

## 🔒 Mandatory Rollover & 7-Item Gate Lock

Day $N+1$ cannot be unlocked until all 7 criteria are fulfilled:
1. **Practice Target:** All 200 practice questions scored.
2. **Practice Review:** Daily practice questions review confirmed in the Review Center.
3. **Mock Exam 1:** Completed and scored (0–90).
4. **Mock Exam 1 Review:** Deep error analysis and corrective actions logged.
5. **Mock Exam 2:** Completed and scored (0–90).
6. **Mock Exam 2 Review:** Deep error analysis and corrective actions logged.
7. **Daily Drills:** Write Essay Template (5x), Tongue Twisters (2x), Academic Collocations (2x).

> [!NOTE]
> If a day is incomplete, unfinished work carries over. Changing the calendar date or active day dropdown does not unlock future locked days. An emergency recovery unlock is available for accidental data-entry errors, requiring a logged reason.

---

## 💻 Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ / v24+ recommended).
- **npm:** v9.0.0 or higher.
- **Firebase Account:** Standard Firebase account with access to project `ptemarkstracking`.

---

## 📦 Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thimathi/pte_marks_tracker.git
   cd pte_marks_tracker
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

---

## 🔑 Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```ini
VITE_FIREBASE_API_KEY=AIzaSyAWjEaga0BkWoFCSiSHeWwtTmmAIWos2qY
VITE_FIREBASE_AUTH_DOMAIN=ptemarkstracking.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://ptemarkstracking-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=ptemarkstracking
VITE_FIREBASE_STORAGE_BUCKET=ptemarkstracking.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=651634483350
VITE_FIREBASE_APP_ID=1:651634483350:web:487c35818c7cdb0dbba2b7
VITE_FIREBASE_MEASUREMENT_ID=G-230XBRNKCG
```

---

## 🛡️ Firebase Setup & Authentication

1. **Enable Email/Password Sign-In:**
   - In [Firebase Console](https://console.firebase.google.com/project/ptemarkstracking/authentication/providers), navigate to **Authentication** > **Sign-in method**.
   - Enable **Email/Password** provider and click **Save**.
2. **Authorized Domains:**
   - Ensure `ptemarkstracking.web.app`, `ptemarkstracking.firebaseapp.com`, and `localhost` are listed under **Authorized domains**.

---

## 🗄️ Database Architecture & Security Rules

All records are scoped exclusively to the authenticated user's UID:

```text
users/
  {uid}/
    profile/
    studyPlan/
      startDate
      durationDays (21)
      currentDay
      targetScores
      questionTargets
    days/
      day01/ ... day21/
        date
        status ('locked' | 'active' | 'completed' | 'overdue')
        questionProgress/
          {typeId}/attempts/{qIndex}
        mockExams/
          mock01/
          mock02/
        mockReviews/
          review01/
          review02/
        additionalExercises/
        gateStatus/
    activityLog/
```

### Security Rules (`database.rules.json`)
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

---

## 🧪 Running Unit Tests

The test suite verifies queue generation, 200 questions breakdown, phase averages, blank score omission, 7-item gate requirements, and day locking:

```bash
# Run all vitest tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🚀 Production Build & Firebase Deployment

1. **Build the production frontend bundle:**
   ```bash
   npm run build
   ```
   This generates optimized assets in `dist/`.

2. **Authenticate Firebase CLI (if not already logged in):**
   ```bash
   npx firebase-tools login
   ```

3. **Select the Firebase project:**
   ```bash
   npx firebase-tools use ptemarkstracking
   ```

4. **Deploy Database Security Rules:**
   ```bash
   npx firebase-tools deploy --only database
   ```

5. **Deploy Frontend to Firebase Hosting:**
   ```bash
   npx firebase-tools deploy --only hosting
   ```

---

## 🔄 Legacy Data Migration

To import scores from the legacy single-file tracker (`pte_academic_75plus_question_logger`):
1. Open the application in the same browser where your legacy data was saved.
2. Navigate to **Settings & Import** (`/settings`).
3. Under **Legacy HTML LocalStorage Data Importer**, click **Scan Browser Storage**.
4. Review the detected dates, scored attempts, and mock exams.
5. Click **Migrate Found Records into Firebase**. Your data will be converted and safely synchronized without data loss.

---

## 📊 CSV Export & Reporting

From the **Trends & Stats** (`/analytics`) or **Final 21-Day Report** (`/report/final`) page:
- **Export Practice CSV:** Full question-by-question record with Day, Date, Skill, Module, Score, Flagged status, and Notes.
- **Export 42 Mocks CSV:** Complete log of all 42 mock simulation exams and review records.
- **Print to PDF:** Formats an executive 21-day audit ready to save via your browser's Print dialog (`Ctrl+P` / `Cmd+P`).

---

## 🔧 Troubleshooting Guide

- **Firebase Permission Denied / Error saving score:**
  Ensure you are signed in. Guest users cannot write to the database. Verify that Email/Password provider is active in the Firebase Console.
- **Port 5173 already in use:**
  Run `npm run dev -- --port 5174` or terminate the existing process.
- **Firebase CLI `UnauthorizedAccess` in PowerShell:**
  Use `cmd.exe /c "npx firebase-tools ..."` or run PowerShell as Administrator and execute `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
