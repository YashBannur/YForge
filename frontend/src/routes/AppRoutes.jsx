import { Routes, Route } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import Landing from "../pages/student/Landing"
import Login from "../pages/student/Login"
import Problems from "../pages/student/Problems"

function AppRoutes() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={<Problems />} />
      </Routes>
    </PageLayout>
  )
}

export default AppRoutes