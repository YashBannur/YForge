YForge — Forge Your Coding Skills 🔥

A full-stack, LeetCode-style Java coding practice platform built from scratch — auth, problem management, an in-browser Monaco code editor, a real Java execution engine, progress tracking, gamification, and trainer analytics.

🔗 Live app: y-forge-inky.vercel.app 🔗 API: yforge-backend.onrender.com

Note: the backend is hosted on a free tier and goes to sleep after 15 minutes of inactivity — the first request after a while may take 30–60 seconds to respond while it wakes up.

What is YForge?

YForge is a learning-first coding platform inspired by LeetCode, CodingBat, GitHub, and VS Code. Students solve hand-crafted Java problems directly in the browser, get instant feedback against real test cases, and track their progress through streaks, achievements, and leaderboards. Trainers create and manage problems, and get analytics on student activity and performance.

Built end-to-end as a learning project — every architectural decision, from JWT auth to a custom multi-mode Java execution engine, was designed and implemented iteratively, phase by phase.

Features

Student

Register/login with JWT authentication
Browse problems with difficulty, topic, and solved/unsolved filters
Solve problems in a Monaco-based code editor (VS Code's editor, in the browser) with Java snippets, theme switching, and copy-paste protection
Run code against visible test cases, or submit against the full test suite (including hidden tests)
Progressive hints (3 per problem, revealed one at a time)
Forge Streaks, a GitHub-style activity heatmap, and a Daily Forge Challenge
Achievements with live progress tracking (e.g. "23/50 solved")
Global leaderboard, ranked by problems solved
Profile and settings (email, password, editor preferences)

Trainer

Full problem CRUD, including dynamic test case management (visible/hidden)
Terminal-styled trainer dashboard: live stats, recent submissions feed, per-problem success rates
Student roster with individual student detail pages (stats, heatmap, submissions, achievements)
Analytics: submission trends, difficulty distribution, student activity

Platform

Three distinct Java execution modes, auto-detected from submitted code:
stdin/stdout programs — full main()-based submissions
Single-method submissions — LeetCode-style bare methods (public int[] twoSum(...)), auto-wrapped and executed via generated harness code
Class-mode, stateful submissions — OOP problems (encapsulation, inheritance, overloading) executed via reflection-based method dispatch against a constructed instance
Structural enforcement of hidden test case privacy — hidden test data is never present in any response DTO sent to students, at the type level, not just filtered at runtime
Toast notifications and custom confirm modals throughout
Role-based access control enforced at both the API layer (@PreAuthorize) and the frontend route layer
Tech Stack

Backend

Java 21, Spring Boot, Spring Security, Spring Data JPA
JWT authentication (jjwt)
MySQL
Process-based Java code execution (javac/java via ProcessBuilder, timeout-guarded)

Frontend

React (Vite)
Tailwind CSS
React Router
Axios
Monaco Editor (@monaco-editor/react)
Recharts (analytics charts)

Infrastructure

Backend: Docker container on Render
Database: Aiven for MySQL
Frontend: Vercel
Architecture Notes

A few decisions worth calling out for anyone reading the code:

DTOs enforce data boundaries structurally. Student-facing and trainer-facing views of a Problem are separate DTO classes — the student-facing one has no field for hidden test data at all, rather than relying on a runtime filter that could be forgotten later.
The code execution engine wraps submissions dynamically. Rather than forcing every problem into one execution style, ExecutionService detects whether submitted code is a complete program, a bare method, or a class definition, and generates the appropriate Java wrapper/harness at compile time — using reflection for class-mode problems to support arbitrary method sequences without per-problem configuration.
The leaderboard and progress stats are computed, not stored. Rank, streaks, and solved counts are derived live from the submissions table rather than kept in a denormalized column that could drift out of sync.
Known Limitations
Code execution runs directly on the host process with a wall-clock timeout as the only safety guard — no CPU/memory isolation or containerized sandboxing per submission. Fine for a learning project with trusted users; would need Docker-per-submission isolation before opening to the public.
Free-tier hosting means the backend cold-starts after inactivity.
Running Locally
Prerequisites
Java 21, Maven
Node.js 18+
MySQL 8
Backend
bash
cd backend
# create src/main/resources/application-secrets.properties with:
#   spring.datasource.password=<your local MySQL password>
#   jwt.secret=<any long random string>
#   trainer.seed.password=<a password for the seeded trainer account>
./mvnw spring-boot:run

Runs on http://localhost:8080.

Frontend
bash
cd frontend
npm install
npm run dev

Runs on http://localhost:5173.

Project Structure
YForge/
├── backend/
│   └── src/main/java/com/yforge/backend/
│       ├── config/       # Security, CORS, data seeding
│       ├── controller/   # REST endpoints
│       ├── service/      # Business logic, execution engine
│       ├── repository/   # Spring Data JPA interfaces
│       ├── entity/       # JPA entities
│       ├── dto/          # Request/response DTOs
│       ├── exception/    # Global exception handling
│       └── security/     # JWT filter, user details
└── frontend/
    └── src/
        ├── pages/         # student/ and trainer/ route pages
        ├── components/    # shared UI components
        ├── context/       # Auth and Toast contexts
        ├── api/           # Axios API layer
        └── routes/        # route definitions and guards

Built by Yash Bannur.