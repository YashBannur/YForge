import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Landing() {
  const { user } = useAuth()

  const features = [
    { icon: "🔥", title: "Forge Streaks", desc: "Build daily coding habits and track your progress over time." },
    { icon: "🧩", title: "Real Problems", desc: "Solve hand-crafted Java problems with progressive hints, never full solutions." },
    { icon: "⚡", title: "Instant Feedback", desc: "Run and submit code against real test cases, right in your browser." },
    { icon: "🏆", title: "Achievements", desc: "Earn badges for milestones, streaks, and daily challenges." },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Forge Your <span className="text-[var(--color-forge-500)]">Coding Skills</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8">
          A learning-first coding platform. Write every line yourself, build real problem-solving skill,
          one forged solution at a time.
        </p>
        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link
              to={user.role === "TRAINER" ? "/trainer/dashboard" : "/dashboard"}
              className="bg-[var(--color-forge-500)] hover:bg-[var(--color-forge-600)] text-white font-semibold px-6 py-3 rounded transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-[var(--color-forge-500)] hover:bg-[var(--color-forge-600)] text-white font-semibold px-6 py-3 rounded transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-[var(--color-border)] hover:border-[var(--color-forge-500)] text-[var(--color-text-primary)] font-semibold px-6 py-3 rounded transition"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-20">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5 text-center"
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Landing