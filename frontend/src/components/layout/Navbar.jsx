import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
              </>
            ) : (
              <Link to="/dashboard" className="hover:text-[var(--color-text-primary)]">Dashboard</Link>
            )}
            <span className="text-[var(--color-text-primary)]">
              {user.username} <span className="text-xs text-[var(--color-forge-500)]">({user.role})</span>
            </span>
            <button onClick={handleLogout} className="hover:text-[var(--color-danger)]">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-[var(--color-text-primary)]">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar