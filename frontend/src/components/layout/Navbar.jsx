import { useState, useRef, useEffect } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // =========================================================
  // NAVLINK STYLE
  // =========================================================

  const navLinkClass = ({ isActive }) =>
    `
      relative
      transition-all duration-200
      ${
        isActive
          ? "text-[var(--color-forge-500)] font-semibold"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      }
    `

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">

      {/* =====================================================
          LOGO
      ====================================================== */}

      <Link
        to="/"
        className="text-xl font-bold text-[var(--color-forge-500)]"
      >
        YForge
      </Link>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <div className="flex items-center gap-6 text-sm">

        {/* Problems */}
        <NavLink
          to="/problems"
          className={navLinkClass}
        >
          {({ isActive }) => (
            <>
              Problems

              {isActive && (
                <span
                  className="
                    absolute
                    left-0
                    right-0
                    -bottom-2
                    h-0.5
                    rounded-full
                    bg-[var(--color-forge-500)]
                  "
                />
              )}
            </>
          )}
        </NavLink>

        {/* Leaderboard */}
        <NavLink
          to="/leaderboard"
          className={navLinkClass}
        >
          {({ isActive }) => (
            <>
              Leaderboard

              {isActive && (
                <span
                  className="
                    absolute
                    left-0
                    right-0
                    -bottom-2
                    h-0.5
                    rounded-full
                    bg-[var(--color-forge-500)]
                  "
                />
              )}
            </>
          )}
        </NavLink>

        {/* =================================================
            LOGGED IN USER
        ================================================== */}

        {user ? (
          <>
            {/* =============================================
                TRAINER NAVIGATION
            ============================================== */}

            {user.role === "TRAINER" ? (
              <>
                {/* Trainer Dashboard */}
                <NavLink
                  to="/trainer/dashboard"
                  className={navLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      Trainer Dashboard

                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            right-0
                            -bottom-2
                            h-0.5
                            rounded-full
                            bg-[var(--color-forge-500)]
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>

                {/* Manage Problems */}
                <NavLink
                  to="/trainer/problems"
                  className={navLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      Manage Problems

                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            right-0
                            -bottom-2
                            h-0.5
                            rounded-full
                            bg-[var(--color-forge-500)]
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>

                {/* Students */}
                <NavLink
                  to="/trainer/students"
                  className={navLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      Students

                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            right-0
                            -bottom-2
                            h-0.5
                            rounded-full
                            bg-[var(--color-forge-500)]
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </>
            ) : (

              /* ===========================================
                  STUDENT NAVIGATION
              ============================================ */

              <NavLink
                to="/dashboard"
                className={navLinkClass}
              >
                {({ isActive }) => (
                  <>
                    Dashboard

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          right-0
                          -bottom-2
                          h-0.5
                          rounded-full
                          bg-[var(--color-forge-500)]
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            )}

            {/* =================================================
                USER DROPDOWN
            ================================================== */}

            <div
              className="relative"
              ref={menuRef}
            >
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="
                  flex
                  items-center
                  gap-1
                  text-[var(--color-text-primary)]
                  hover:text-[var(--color-forge-500)]
                  transition-colors
                "
              >
                {user.username}

                <span className="text-xs text-[var(--color-forge-500)]">
                  ({user.role})
                </span>

                <span className="text-xs ml-1">
                  {menuOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-2
                    w-40
                    bg-[var(--color-bg-secondary)]
                    border
                    border-[var(--color-border)]
                    rounded-lg
                    shadow-lg
                    overflow-hidden
                    z-20
                  "
                >

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="
                      block
                      px-4
                      py-2
                      text-sm
                      hover:bg-[var(--color-bg-tertiary)]
                      transition-colors
                    "
                  >
                    Profile
                  </Link>

                  {/* Settings */}
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="
                      block
                      px-4
                      py-2
                      text-sm
                      hover:bg-[var(--color-bg-tertiary)]
                      transition-colors
                    "
                  >
                    Settings
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="
                      block
                      w-full
                      text-left
                      px-4
                      py-2
                      text-sm
                      text-[var(--color-danger)]
                      hover:bg-[var(--color-bg-tertiary)]
                      transition-colors
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (

          /* =================================================
              NOT LOGGED IN
          ================================================== */

          <NavLink
            to="/login"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Login

                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      right-0
                      -bottom-2
                      h-0.5
                      rounded-full
                      bg-[var(--color-forge-500)]
                    "
                  />
                )}
              </>
            )}
          </NavLink>
        )}
      </div>
    </nav>
  )
}

export default Navbar