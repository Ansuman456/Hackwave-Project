import { Routes, Route } from "react-router-dom"

import { Layout } from "@/components/layout"
import { RequireAuth } from "@/components/require-auth"
import Create from "@/pages/Create"
import Dashboard from "@/pages/Dashboard"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Project from "@/pages/Project"
import Signup from "@/pages/Signup"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequireAuth>
              <Create />
            </RequireAuth>
          }
        />
        <Route
          path="/project/:id"
          element={
            <RequireAuth>
              <Project />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
