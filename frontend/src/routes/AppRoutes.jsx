import { Routes, Route } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import ProtectedRoute from "./ProtectedRoute"
import Landing from "../pages/student/Landing"
import Login from "../pages/student/Login"
import Register from "../pages/student/Register"
import Problems from "../pages/student/Problems"
import Dashboard from "../pages/student/Dashboard"
import TrainerDashboard from "../pages/trainer/TrainerDashboard"

function AppRoutes() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT", "TRAINER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute allowedRoles={["STUDENT", "TRAINER"]}>
              <Problems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["TRAINER"]}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </PageLayout>
  )
}

export default AppRoutes