import { Routes, Route } from "react-router-dom"

import { Layout } from "@/components/layout"
import Create from "@/pages/Create"
import Home from "@/pages/Home"
import Project from "@/pages/Project"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
