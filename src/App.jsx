import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Student imports
import StudentDashboard from './pages/student/StudentDashboard'
import CreateProject from './pages/student/CreateProject'
import ProjectList from './pages/student/ProjectList'
import ProjectProgress from './pages/student/ProjectProgress'
import Portfolio from './pages/student/Portfolio'

// Admin imports
import AdminDashboard from './pages/admin/AdminDashboard'

// Auth Context & Global Components
import { AuthProvider } from './context/AuthContext'
import AppNavbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppNavbar />
          <div className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]}><StudentDashboard /></ProtectedRoute>}
              />
              <Route
                path="/student/projects/create"
                element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]}><CreateProject /></ProtectedRoute>}
              />
              <Route
                path="/student/projects"
                element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]}><ProjectList /></ProtectedRoute>}
              />
              <Route
                path="/student/projects/:id"
                element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]}><ProjectProgress /></ProtectedRoute>}
              />
              <Route
                path="/student/portfolio"
                element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]}><Portfolio /></ProtectedRoute>}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><AdminDashboard /></ProtectedRoute>}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
