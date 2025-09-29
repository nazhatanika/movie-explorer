import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./routes/Layout"
import DetailView from "./routes/DetailView"

// Render the app and configure routes
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root layout */}
        <Route path="/" element={<Layout />}>
          {/* Home page */}
          <Route index element={<App />} />
          {/* Movie details page */}
          <Route path="movieDetails/:id" element={<DetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)