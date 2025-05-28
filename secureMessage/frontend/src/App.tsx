import React, { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Login } from './components/Login'
import Register from './components/Register'
import ForgotUID from './components/ForgotUID'
import MessageEncoder from './components/MessageEncoder'

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

// Main App component
const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-uid" element={<ForgotUID />} />
        <Route path="/encoder" element={<MessageEncoder />} />
        <Route path="/" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

// Root App component with providers
const App: React.FC = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App 