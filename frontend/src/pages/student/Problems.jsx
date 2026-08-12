import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProblems } from "../../api/problemApi"
import DifficultyBadge from "../../components/common/DifficultyBadge"

function Problems() {
  const [problems, setProblems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const [difficultyFilter, setDifficultyFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [topicFilter, setTopicFilter] = useState("ALL")

  useEffect(() => {
    getProblems()
      .then((res) => setProblems(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load problems"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-[var(--color-text-secondary)]">Loading problems...</p>
  if (error) return <p className="text-[var(--color-danger)]">{error}</p>

  const topics = ["ALL", ...Array.from(new Set(problems.map((p) => p.topic)))]

  const filtered = [...problems]
    .sort((a, b) => a.id - b.id)
    .filter((p) => difficultyFilter === "ALL" || p.difficulty === difficultyFilter)
    .filter((p) => statusFilter === "ALL" || (statusFilter === "SOLVED" ? p.solved : !p.solved))
    .filter((p) => topicFilter === "ALL" || p.topic === topicFilter)

  const pillClass = (active) =>
    `text-xs font-medium px-3 py-1.5 rounded-full border transition ${
      active
        ? "bg-[var(--color-forge-500)] text-white border-[var(--color-forge-500)]"
        : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-forge-500)]"
    }`

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Problems</h1>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {["ALL", "EASY", "MEDIUM", "HARD"].map((d) => (
          <button key={d} onClick={() => setDifficultyFilter(d)} className={pillClass(difficultyFilter === d)}>
            {d}
          </button>
        ))}
        <span className="w-px h-5 bg-[var(--color-border)] mx-1" />
        {["ALL", "SOLVED", "UNSOLVED"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={pillClass(statusFilter === s)}>
            {s}
          </button>
        ))}
        <span className="w-px h-5 bg-[var(--color-border)] mx-1" />
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full px-3 py-1.5 text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-forge-500)]"
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t === "ALL" ? "All Topics" : t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No problems match these filters.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p, index) => (
            <Link
              key={p.id}
              to={`/problems/${p.id}`}
              className="flex items-center justify-between bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-forge-500)] transition"
            >
              <div className="flex items-center gap-3">
                {p.solved && <span className="text-[var(--color-success)]">✓</span>}
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