import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <Link to="/" className="text-xl font-bold text-[var(--color-forge-500)]">
        YForge
      </Link>
      <div className="flex gap-6 text-sm text-[var(--color-text-secondary)]">
        <Link to="/problems" className="hover:text-[var(--color-text-primary)]">Problems</Link>
        <Link to="/leaderboard" className="hover:text-[var(--color-text-primary)]">Leaderboard</Link>
        <Link to="/login" className="hover:text-[var(--color-text-primary)]">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar