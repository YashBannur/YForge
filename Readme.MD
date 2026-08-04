
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