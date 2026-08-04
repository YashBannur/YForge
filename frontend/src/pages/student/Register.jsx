import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../../api/authApi"
import { useAuth } from "../../context/AuthContext"

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: ""})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await registerUser(form)
      login(response.data)
      navigate("/dashbaord")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-[var(--color-danger)]/10 border border-[var(--color-danger)] text-[var(--color-danger)] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-forge-500)]"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-forge-500)]"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-forge-500)]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--color-forge-500)] hover:bg-[var(--color-forge-600)] text-white font-semibold py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-[var(--color-text-secondary)] text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-[var(--color-forge-500)] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default Register