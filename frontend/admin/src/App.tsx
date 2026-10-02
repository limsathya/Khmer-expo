import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Registrations from "./pages/Registrations";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./theme/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-background text-foreground">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/registrations" element={<Registrations />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}
