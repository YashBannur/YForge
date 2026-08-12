import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
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
    navigate("/login")
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <Link to="/" className="text-xl font-bold text-[var(--color-forge-500)]">
        YForge
      </Link>
      <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
        <Link to="/problems" className="hover:text-[var(--color-text-primary)]">Problems</Link>
        <Link to="/leaderboard" className="hover:text-[var(--color-text-primary)]">Leaderboard</Link>

        {user ? (
          <>
            {user.role === "TRAINER" ? (
              <>
                <Link to="/trainer/dashboard" className="hover:text-[var(--color-text-primary)]">Trainer Dashboard</Link>
                <Link to="/trainer/problems" className="hover:text-[var(--color-text-primary)]">Manage Problems</Link>
                {/* <Link to="/trainer/analytics" className="hover:text-[var(--color-text-primary)]">Analytics</Link> */}
                <Link to="/trainer/students" className="hover:text-[var(--color-text-primary)]">Students</Link>
              </>
            ) : (
              <Link to="/dashboard" className="hover:text-[var(--color-text-primary)]">Dashboard</Link>
            )}

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
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-bg-tertiary)]"
                  >
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
    </nav>
  )
}

export default Navbar