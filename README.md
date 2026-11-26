# MentorLagbe (Client Side) 🎓
> **Smart Tuition & Mentorship Platform** — Connecting qualified subject mentors with ambitious learners across Bangladesh for personalized 1-on-1 tutoring and small batches.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌐 Live Links & Repositories
- **Live Website:** [MentorLagbe on Vercel](https://mentorlagbe-five.vercel.app) *(or your deployed Vercel URL)*
- **Client Repository:** [https://github.com/EHMahi9/MentorLagbe-Client](https://github.com/EHMahi9/MentorLagbe-Client)
- **Server Repository:** [https://github.com/EHMahi9/MentorLagbe-Server](https://github.com/EHMahi9/MentorLagbe-Server)
- **Backend API Base URL:** [https://mentorlagbe-server.onrender.com/api](https://mentorlagbe-server.onrender.com/api)

---

## 🔐 Test Evaluation Credentials
Use the following verified credentials to log in manually via the Sign In page:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mentorlagbe.com` | `Admin@12345` | User management & role changes, tuition approval/rejection moderation, global transaction ledger & system analytics |
| **Tutor (Pro)** | `tutor@mentorlagbe.com` | `Tutor@12345` | Unlimited tuition posting, applicant management (Accept/Reject), live status toggles, ImgBB cover upload |
| **Student** | `student@mentorlagbe.com` | `Student@12345` | Browse & search tuitions, bookmark/save posts, submit tuition applications with notes, track application history, cancel pending applications |

---

## 🚀 Key Features

### 1. Public & Core Experience
- **Responsive Hero & Discovery:** Modern UI with hero search, subject badges, and real-time statistics.
- **Browse Tuitions with Advanced Server-Side Filters:**
  - Real-time text search (Title, Subject, Location).
  - Multi-select and dropdown filters for **Subject**, **Class Level**, and **Tuition Mode** (Online, In-Person, Hybrid).
  - Server-side pagination with clean previous/next controls.
- **Tuition Details Page:** Full breakdown of tuition requirements, tutor bio, interactive apply modal with duplicate prevention, and bookmarking.
- **Dark / Light Mode:** Built-in seamless theme toggle saved in `localStorage` with system preference detection.
- **No-Logout On Reload:** Robust client-side auth context keeping token in sync with automatic profile restoration.

### 2. Role-Based Dashboards
- **Student Dashboard:**
  - Overview cards: Applications count, Saved tuitions, Accepted tutors.
  - **My Applications:** Filterable table of submitted applications with status badges (`pending`, `accepted`, `rejected`) and option to cancel pending applications.
  - **Saved Tuitions:** Quick access to bookmarked tuitions.
- **Tutor Dashboard:**
  - **2-Post Free Limit & Pro Upgrades:** Free plan tutors can post up to 2 active tuitions; posting more prompts a Stripe Pro upgrade.
  - **Post a Tuition:** Complete creation form with direct ImgBB image cover upload and auto-tagging.
  - **My Tuitions (CRUD):** View, edit, toggle active/inactive, or delete existing postings.
  - **Applicants Tracking:** Review student applications, inspect qualifications, and Accept or Reject with automatic status updates.
- **Admin Dashboard:**
  - Platform-wide statistics (Total users, active tuitions, applications, revenue).
  - **User Management:** Promote or update user roles (Student, Tutor, Admin).
  - **Tuition Moderation:** Approve or reject newly submitted tuition postings.
  - **Transaction Ledger:** Complete history of Stripe payments and subscriptions.

### 3. All 3 Assignment Challenges Implemented
1. **Server-Side Search & Filter:** The `/tuitions` page utilizes query parameters sent directly to backend Express endpoints for instant, paginated results without heavy client bundle overhead.
2. **JWT Token Verification & Custom Role Middlewares:** Protected routes on both client and server enforce verification (`verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`).
3. **Direct Image Upload via ImgBB API:**
   - Client uploads images directly to ImgBB via FormData.
   - Profile photo and tuition cover image preview with loading states and URL persistence.

---

## 🛠️ Tech Stack & NPM Packages

### Core Frameworks
- **Next.js 15.2 (App Router):** High-performance server and client components.
- **React 19:** Modern hooks and concurrent rendering.
- **TypeScript 5:** Strict static typing for clean, maintainable architecture.
- **Tailwind CSS v4:** Modern, utility-first responsive styling with custom CSS variables.

### Key Libraries
- `lucide-react`: Modern vector icon library.
- `react-hot-toast`: Accessible, animated toast notifications.
- `canvas-confetti`: Celebratory animations for successful payments and applications.
- `@stripe/stripe-js`: Client integration for secure Stripe Checkout redirection.

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/EHMahi9/MentorLagbe-Client.git
cd MentorLagbe-Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=d81643c726eeeb5726224f8d9510619a
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📂 Project Structure
```
client/
├── app/
│   ├── dashboard/
│   │   ├── admin/             # Admin moderation, users, transactions
│   │   ├── tutor/             # Post tuition, my tuitions, applicants
│   │   ├── student/           # My applications, saved tuitions
│   │   ├── profile/           # User profile & ImgBB photo upload
│   │   └── layout.tsx         # Dashboard sidebar & layout
│   ├── tuitions/
│   │   ├── [id]/page.tsx      # Tuition details & apply modal
│   │   └── page.tsx           # Browse tuitions with search & filters
│   ├── pricing/page.tsx       # Free vs Pro plans & Stripe checkout
│   ├── payment/               # Success (with confetti) and Cancel pages
│   ├── sign-in/page.tsx       # Auth with 1-click demo logins
│   ├── sign-up/page.tsx       # Role-based registration
│   ├── layout.tsx             # Root layout with AuthProvider & Toaster
│   ├── page.tsx               # Modern landing page
│   ├── globals.css            # Tailwind CSS & theme variables
│   ├── loading.tsx            # Global skeleton loader
│   ├── error.tsx              # Error boundary
│   └── not-found.tsx          # 404 page
├── components/
│   ├── Navbar.tsx             # Responsive header with theme toggle & user dropdown
│   ├── Footer.tsx             # Footer with official X, LinkedIn, GitHub icons
│   └── TuitionCard.tsx        # Uniform height card with badges & actions
└── lib/
    ├── api.ts                 # Fetch wrapper with JWT injection
    ├── authContext.tsx        # Persistent auth and dark mode provider
    └── imgbb.ts               # Direct ImgBB API image upload helper
```

---

## 📄 License
This project is submitted for **Assignment 9 — Category: 001** under the MIT License.
Built with dedication by **EHMahi9**.
