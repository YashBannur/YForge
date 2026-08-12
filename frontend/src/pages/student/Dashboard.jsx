import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getDashboard } from "../../api/dashboardApi"
import { getTodaysChallenge } from "../../api/dailyChallengeApi"
import { getAchievements } from "../../api/achievementApi"
import StatCard from "../../components/common/StatCard"


function DailyChallengeCard() {
  const [challenge, setChallenge] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getTodaysChallenge()
      .then((res) => setChallenge(res.data))
      .catch(() => setChallenge(null))
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded) return null

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-2">Daily Forge Challenge 🔥</h2>
      {challenge ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{challenge.title}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {challenge.topic} · {challenge.rewardPoints} pts
            </p>
          </div>
          {challenge.solvedToday ? (
            <span className="text-sm text-[var(--color-success)]">✓ Solved today</span>
          ) : (
            <Link
              to={`/problems/${challenge.problemId}`}
              className="bg-[var(--color-forge-500)] hover:bg-[var(--color-forge-600)] text-white text-sm px-4 py-2 rounded"
            >
              Solve Now
            </Link>
          )}
        </div>
      ) : (
        <p className="text-[var(--color-text-secondary)] text-sm">No challenge set for today.</p>
      )}
    </div>
  )
}

function AchievementsCard() {
  const [achievements, setAchievements] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getAchievements()
      .then((res) => setAchievements(res.data))
      .catch(() => setAchievements([]))
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded) return null

  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5 mt-6">
      <h2 className="text-lg font-semibold mb-3">Achievements 🏆</h2>
      {achievements.length === 0 ? (
        <p className="text-[var(--color-text-secondary)] text-sm">No achievements yet. Solve a problem to earn one!</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {achievements.map((a) => (
            <div
              key={a.code}
              title={a.description}
              className="flex items-center gap-2 bg-[var(--color-bg-tertiary)] rounded-lg px-3 py-2 text-sm"
            >
              <span className="text-lg">{a.icon}</span>
              <span>{a.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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

      <DailyChallengeCard />
      <AchievementsCard />
    </div>
  )
}

export default Dashboard