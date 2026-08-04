import { useState, useEffect } from "react"
import { getDashboard } from "../../api/dashboardApi"
import StatCard from "../../components/common/StatCard"

function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-[var(--color-text-secondary)]">Loading dashboard...</p>
  }

  if (error) {
    return <p className="text-[var(--color-danger)]">{error}</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome back, {data.username} 👋</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">Ready to forge something today?</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Problems Solved" value={data.problemsSolved} />
        <StatCard label="Current Streak" value={`${data.forgeStreakCurrent} 🔥`} accent />
        <StatCard label="Rank" value={data.rank ?? "—"} />
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-2">Daily Forge Challenge</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">Coming soon — Phase 13.</p>
      </div>
    </div>
  )
}

export default Dashboard