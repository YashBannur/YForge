import { useState, useEffect } from "react"
import { getTrainerDashboard } from "../../api/trainerApi"
import StatCard from "../../components/common/StatCard"

function TrainerDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrainerDashboard()
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
      <h1 className="text-2xl font-bold mb-1">Trainer Dashboard</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">Welcome, {data.username}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={data.totalStudents} accent />
        <StatCard label="Active Students" value={data.activeStudents} />
        <StatCard label="Problems" value={data.totalProblems} />
        <StatCard label="Today's Submissions" value={data.todaysSubmissions} />
      </div>
    </div>
  )
}

export default TrainerDashboard