import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("yforge_token")
    const username = localStorage.getItem("yforge_username")
    const role = localStorage.getItem("yforge_role")

    if (token && username && role) {
      setUser({ token, username, role })
    }
    setLoading(false)
  }, [])

  const login = (authResponse) => {
    localStorage.setItem("yforge_token", authResponse.token)
    localStorage.setItem("yforge_username", authResponse.username)
    localStorage.setItem("yforge_role", authResponse.role)
    setUser(authResponse)
  }

  const logout = () => {
    localStorage.removeItem("yforge_token")
    localStorage.removeItem("yforge_username")
    localStorage.removeItem("yforge_role")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}