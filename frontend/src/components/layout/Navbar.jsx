import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setMobileNavOpen(false)
    navigate("/login")
  }

  const closeMobile = () => setMobileNavOpen(false)

  const trainerLinks = (
    <>
      <Link to="/trainer/dashboard" onClick={closeMobile} className="hover:text-[var(--color-text-primary)]">
        Trainer Dashboard
      </Link>
      <Link to="/trainer/problems" onClick={closeMobile} className="hover:text-[var(--color-text-primary)]">
        Manage Problems
      </Link>
      <Link to="/trainer/students" onClick={closeMobile} className="hover:text-[var(--color-text-primary)]">
        Students
      </Link>
      <Link to="/trainer/analytics" onClick={closeMobile} className="hover:text-[var(--color-text-primary)]">
        Analytics
      </Link>
    </>
  )

  const studentLinks = (
    <Link to="/dashboard" onClick={closeMobile} className="hover:text-[var(--color-text-primary)]">
      Dashboard
    </Link>
  )

  return (
    <nav className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/" className="text-xl font-bold text-[var(--color-forge-500)]">
          YForge
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
          <Link to="/problems" className="hover:text-[var(--color-text-primary)]">Problems</Link>
          <Link to="/leaderboard" className="hover:text-[var(--color-text-primary)]">Leaderboard</Link>

          {user ? (
            <>
              {user.role === "TRAINER" ? trainerLinks : studentLinks}

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-1 text-[var(--color-text-primary)] hover:text-[var(--color-forge-500)]"
                >
                  {user.username} <span className="text-xs text-[var(--color-forge-500)]">({user.role})</span>
                  <span className="text-xs ml-1">{menuOpen ? "▲" : "▼"}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-20">
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]">
                      Profile
                    </Link>
                    <Link to="/settings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]">
                      Settings
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-bg-tertiary)]">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="hover:text-[var(--color-text-primary)]">Login</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileNavOpen((o) => !o)}
          className="md:hidden text-[var(--color-text-primary)] text-2xl leading-none px-2"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileNavOpen && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-3">
          <Link to="/problems" onClick={closeMobile} className="py-2 hover:text-[var(--color-text-primary)]">Problems</Link>
          <Link to="/leaderboard" onClick={closeMobile} className="py-2 hover:text-[var(--color-text-primary)]">Leaderboard</Link>

          {user ? (
            <>
              {user.role === "TRAINER" ? trainerLinks : studentLinks}
              <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                <p className="text-[var(--color-text-primary)] py-1">
                  {user.username} <span className="text-xs text-[var(--color-forge-500)]">({user.role})</span>
                </p>
                <Link to="/profile" onClick={closeMobile} className="block py-2 hover:text-[var(--color-text-primary)]">Profile</Link>
                <Link to="/settings" onClick={closeMobile} className="block py-2 hover:text-[var(--color-text-primary)]">Settings</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-[var(--color-danger)]">Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" onClick={closeMobile} className="py-2 hover:text-[var(--color-text-primary)]">Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar