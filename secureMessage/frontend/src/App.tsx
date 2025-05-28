import React, { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import ForgotUID from './components/ForgotUID'
import MessageEncoder from './components/MessageEncoder'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/encoder" />} />
          <Route path="/register" element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/encoder" />} />
          <Route path="/forgot-uid" element={!isAuthenticated ? <ForgotUID setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/encoder" />} />
          <Route path="/encoder" element={isAuthenticated ? <MessageEncoder setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App 