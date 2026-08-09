import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { getAnalytics } from "../../api/analyticsApi"

function Analytics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-[var(--color-text-secondary)]">Loading analytics...</p>
  if (error) return <p className="text-[var(--color-danger)]">{error}</p>

  const difficultyData = Object.entries(data.difficultyDistribution).map(([name, count]) => ({ name, count }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Submission Trend (7 days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.submissionTrend}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={12} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-bg-tertiary)", border: "none" }} />
              <Line type="monotone" dataKey="count" stroke="var(--color-forge-500)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Problem Difficulty</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={difficultyData}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "var(--color-bg-tertiary)", border: "none" }} />
              <Bar dataKey="count" fill="var(--color-forge-500)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Student Activity</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
              <th className="pb-2">Student</th>
              <th className="pb-2">Solved</th>
              <th className="pb-2">Submissions</th>
              <th className="pb-2">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {data.studentActivity.map((s) => (
              <tr key={s.username} className="border-b border-[var(--color-border)]">
                <td className="py-2">{s.username}</td>
                <td className="py-2">{s.problemsSolved}</td>
                <td className="py-2">{s.totalSubmissions}</td>
                <td className="py-2 text-[var(--color-text-secondary)]">
                  {s.lastActive === "Never" ? "Never" : new Date(s.lastActive).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Analytics