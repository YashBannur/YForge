import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

import { getTrainerDashboard } from "../../api/trainerApi"
import { getAnalytics } from "../../api/analyticsApi"
import StatCard from "../../components/common/StatCard"

function TrainerDashboard() {
  const [data, setData] = useState(null)
  const [analyticsData, setAnalyticsData] = useState(null)

  const [error, setError] = useState("")
  const [analyticsError, setAnalyticsError] = useState("")

  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  useEffect(() => {
    getTrainerDashboard()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Failed to load dashboard"
        )
      )
      .finally(() => setLoading(false))

    getAnalytics()
      .then((res) => setAnalyticsData(res.data))
      .catch((err) =>
        setAnalyticsError(
          err.response?.data?.message || "Failed to load analytics"
        )
      )
      .finally(() => setAnalyticsLoading(false))
  }, [])

  if (loading) {
    return (
      <p className="text-[var(--color-text-secondary)]">
        Loading dashboard...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-[var(--color-danger)]">
        {error}
      </p>
    )
  }

  const difficultyData = analyticsData
    ? Object.entries(analyticsData.difficultyDistribution).map(
        ([name, count]) => ({
          name,
          count,
        })
      )
    : []

  return (
    <div>
      {/* ==================== TRAINER DASHBOARD ==================== */}

      <h1 className="text-2xl font-bold mb-1">
        Trainer Dashboard
      </h1>

      <p className="text-[var(--color-text-secondary)] mb-6">
        Welcome, {data.username}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Students"
          value={data.totalStudents}
          accent
        />

        <StatCard
          label="Active Students"
          value={data.activeStudents}
        />

        <StatCard
          label="Problems"
          value={data.totalProblems}
        />

        <StatCard
          label="Today's Submissions"
          value={data.todaysSubmissions}
        />
      </div>

      {/* ==================== ANALYTICS ==================== */}

      <h1 className="text-2xl font-bold mb-6 mt-8">
        Analytics
      </h1>

      {analyticsLoading ? (
        <p className="text-[var(--color-text-secondary)]">
          Loading analytics...
        </p>
      ) : analyticsError ? (
        <p className="text-[var(--color-danger)]">
          {analyticsError}
        </p>
      ) : (
        <>
          {/* Charts */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

            {/* Submission Trend */}

            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">

              <h2 className="text-lg font-semibold mb-4">
                Submission Trend (7 days)
              </h2>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData.submissionTrend}>

                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                    allowDecimals={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "var(--color-bg-tertiary)",
                      border: "none",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-forge-500)"
                    strokeWidth={2}
                  />

                </LineChart>
              </ResponsiveContainer>

            </div>


            {/* Problem Difficulty */}

            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">

              <h2 className="text-lg font-semibold mb-4">
                Problem Difficulty
              </h2>

              <ResponsiveContainer width="100%" height={250}>

                <BarChart data={difficultyData}>

                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                    allowDecimals={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "var(--color-bg-tertiary)",
                      border: "none",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="var(--color-forge-500)"
                    radius={[4, 4, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* Student Activity */}

          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">

            <h2 className="text-lg font-semibold mb-4">
              Student Activity
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="text-left text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">

                    <th className="pb-2">
                      Student
                    </th>

                    <th className="pb-2">
                      Solved
                    </th>

                    <th className="pb-2">
                      Submissions
                    </th>

                    <th className="pb-2">
                      Last Active
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {analyticsData.studentActivity.map((s) => (

                    <tr
                      key={s.username}
                      className="border-b border-[var(--color-border)]"
                    >

                      <td className="py-2">
                        {s.username}
                      </td>

                      <td className="py-2">
                        {s.problemsSolved}
                      </td>

                      <td className="py-2">
                        {s.totalSubmissions}
                      </td>

                      <td className="py-2 text-[var(--color-text-secondary)]">

                        {s.lastActive === "Never"
                          ? "Never"
                          : new Date(
                              s.lastActive
                            ).toLocaleDateString()}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}

    </div>
  )
}

export default TrainerDashboard