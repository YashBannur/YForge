import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getTrainerProblems, deleteProblem } from "../../api/problemApi"
import DifficultyBadge from "../../components/common/DifficultyBadge"
import { useToast } from "../../context/ToastContext"

function TrainerProblems() {
  const [problems, setProblems] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const loadProblems = () => {
    setLoading(true)
    getTrainerProblems()
      .then((res) => setProblems(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load problems"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProblems()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
     await deleteProblem(id)
     setProblems((prev) => prev.filter((p) => p.id !== id))
     showToast(`"${title}" deleted.`, "success")
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete problem", "error")
    }
  }

  if (loading) return <p className="text-[var(--color-text-secondary)]">Loading problems...</p>
  if (error) return <p className="text-[var(--color-danger)]">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Problems</h1>
        <Link
          to="/trainer/problems/new"
          className="bg-[var(--color-forge-500)] hover:bg-[var(--color-forge-600)] text-white font-semibold px-4 py-2 rounded transition"
        >
          + New Problem
        </Link>
      </div>

      {problems.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No problems yet. Create your first one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {[...problems].sort((a, b) => a.id - b.id).map((p, index) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">
                <span className="text-[var(--color-text-secondary)] mr-2">{index + 1}.</span>
                {p.title}
              </span>
              <DifficultyBadge difficulty={p.difficulty} />
                <span className="text-sm text-[var(--color-text-secondary)]">{p.topic}</span>
              </div>
              <div className="flex gap-3 text-sm">
                <Link to={`/trainer/problems/${p.id}/edit`} className="text-[var(--color-forge-500)] hover:underline">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="text-[var(--color-danger)] hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrainerProblems