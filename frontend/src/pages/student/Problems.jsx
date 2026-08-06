import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProblems } from "../../api/problemApi"
import DifficultyBadge from "../../components/common/DifficultyBadge"

function Problems() {
  const [problems, setProblems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProblems()
      .then((res) => setProblems(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load problems"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-[var(--color-text-secondary)]">Loading problems...</p>
  if (error) return <p className="text-[var(--color-danger)]">{error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Problems</h1>

      {problems.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No problems available yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {[...problems].sort((a, b) => a.id - b.id).map((p, index) => (
            <Link
              key={p.id}
              to={`/problems/${p.id}`}
              className="flex items-center justify-between bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-forge-500)] transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  <span className="text-[var(--color-text-secondary)] mr-2">{index + 1}.</span>
                  {p.title}
                </span>
                <span className="text-sm text-[var(--color-text-secondary)]">{p.topic}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--color-text-secondary)]">{p.estimatedTimeMinutes} min</span>
                <DifficultyBadge difficulty={p.difficulty} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Problems