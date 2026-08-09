
feat(phase-2): scaffold backend and frontend, verify full stack boots

- Spring Boot project with Web, JPA, MySQL, Security, Validation, Lombok
- Base package structure for layered architecture
- MySQL connection configured, health-check endpoint verified
- Vite + React frontend with Tailwind, React Router, Axios



feat(phase-3): design system, layout shell, routing skeleton

- Define dark-first theme tokens via Tailwind @theme
- Build Navbar + PageLayout shared layout components
- Wire up react-router-dom with placeholder pages
- Verify SPA navigation with no full reloads




feat(phase-4): implement JWT authentication end-to-end

Backend:
- Add Role and User entities with BCrypt password hashing
- Implement JwtUtil for token generation/validation (HS256)
- Wire Spring Security: CustomUserDetailsService, JwtAuthFilter, stateless SecurityConfig
- Add /api/auth/register and /api/auth/login endpoints
- Add GlobalExceptionHandler for consistent error responses
- Configure CORS for local frontend origin
- Harden registration to always assign STUDENT role server-side (block client-supplied role)
- Seed trainer accounts via DataSeeder instead of public signup

Frontend:
- Add axios instance with JWT auto-attach interceptor
- Add AuthContext for global auth state (localStorage-backed)
- Build real Login and Register pages wired to backend
- Add ProtectedRoute for role-aware route guarding
- Update Navbar to reflect live auth state (user/role/logout)

Fixes:
- Resolve MySQL 8 JDBC public key retrieval connection error (allowPublicKeyRetrieval=true)
- Fix misplaced dto package (was top-level `dto`, moved to com.yforge.backend.dto)




feat(phase-5): student dashboard with real backend data

- Add DashboardResponse DTO, DashboardService, /api/student/dashboard
- Derive current user from SecurityContext (JWT) rather than request params
- Build Dashboard page with reusable StatCard component
- Handle nullable rank distinctly from 0 (no leaderboard yet)
- Update navigation: login/register redirect to /dashboard, Navbar link added


feat(phase-6): trainer dashboard with role-enforced access

- Add TrainerDashboardResponse DTO, TrainerDashboardService, /api/trainer/dashboard
- Add countByRole to UserRepository
- Enforce TRAINER-only access via @PreAuthorize + @EnableMethodSecurity
- Build TrainerDashboard page reusing StatCard component
- Make Navbar and post-login redirect role-aware
- Verify 403 for student JWT and frontend redirect for student navigating to trainer routes



feat(phase-7): problem CRUD with trainer/student DTO separation

Backend:
- Add Problem and TestCase entities with cascade/orphan-removal
- Add ProblemService/ProblemController with full CRUD
- Enforce hidden-test-case boundary via separate DTOs, not runtime filtering
- Fix Lombok/Jackson isHidden naming collision (renamed to hidden)

Frontend:
- Add trainer problem management: list, create, edit, delete
- Build unified ProblemForm handling both create and edit modes
- Add dynamic test case rows with hidden/visible toggle
- Build student-facing problem list with DifficultyBadge, stable numbering



feat(phase-8): Monaco editor, problem detail page, copy-paste protection

Backend:
- Add ProblemDetailResponse, VisibleTestCaseResponse, HintResponse DTOs
- Add getProblemDetailForStudent (visible test cases only, hints excluded)
- Add getHint for progressive single-hint reveal
- Add GET /api/problems/{id} and /api/problems/{id}/hints/{hintNumber}

Frontend:
- Install and configure @monaco-editor/react (Java syntax, dark theme)
- Build ProblemDetail page: split layout (description + editor)
- Add progressive Forge Hints reveal (one at a time, max 3)
- Add ProtectedContent component: blocks copy/cut/select/context-menu with warning toast
- Block editor paste/drag-drop via Monaco onDidPaste + undo, with warning toast
- Wire /problems/:id route



feat(phase-9-10): submission API and Java execution service

Backend:
- Add Submission entity/repository
- Add ExecutionService: compile+run via javac/java with timeout guard
- Add SubmissionService with separate run (visible-only, unsaved) and
  submit (all tests, persisted) paths
- Mask hidden test case details in TestCaseResult structurally
- Fix submitted_at timezone mismatch (serverTimezone=Asia/Kolkata)

Frontend:
- Wire Run/Submit buttons to backend execution
- Add results panel: pass/fail status, per-test breakdown, hidden test masking




feat(phase-11): real progress tracking wired to submissions

- Add lastSolvedDate to User, implement forge streak update logic
- Add countDistinctSolvedProblems to SubmissionRepository
- Wire student dashboard problemsSolved/streak to real submission data
- Add countTodaysSubmissions, countActiveStudents queries
- Wire trainer dashboard to real problem/submission counts  


feat(phase-12): computed leaderboard, no stored ranks

- Add LeaderboardEntry DTO, LeaderboardService (rank by solved count, tie-break by streak)
- Avoid N+1 via grouped query for solved counts per student
- Wire real rank into student dashboard (was previously null)
- Add /api/leaderboard endpoint and frontend Leaderboard page


feat(phase-13): daily forge challenge

- Add DailyChallenge entity (unique constraint per date), repository, DTOs
- Add DailyChallengeService: get today's challenge + solved-today check, trainer set endpoint
- Add GET /api/daily-challenge, PUT /api/trainer/daily-challenge
- Wire DailyChallengeCard into student dashboard with Solve Now / Solved state



feat(phase-14): count and streak-based achievements

- Add Achievement, StudentAchievement entities and repositories
- Seed achievement catalog (solve counts, streak milestones, daily champion)
- Add AchievementService: idempotent award-checking after each PASSED submission
- Wire into SubmissionService (streak update + achievement check on pass)
- Add GET /api/student/achievements
- Display achievements and daily challenge on student dashboard

Deferred: code-pattern achievements (Loop Master, Recursion Warrior, etc.)
require source analysis — separate future phase.


feat(phase-15): trainer analytics dashboard

- Add countSubmissionsByDay, countByDifficulty aggregation queries
- Add AnalyticsResponse, DayCount, StudentActivity DTOs
- Add AnalyticsService: 7-day submission trend, difficulty distribution, per-student activity
- Add GET /api/trainer/analytics (TRAINER only)
- Install recharts, build Analytics page (line chart, bar chart, activity table)
- Wire /trainer/analytics route and nav link