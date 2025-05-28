import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [uid, setUid] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { uid })
      if (response.data.success) {
        setIsAuthenticated(true)
        navigate('/encoder')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid UID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Heading>Login</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>UID</FormLabel>
              <Input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Enter your UID"
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="100%">
              Login
            </Button>
          </VStack>
        </form>
        <Text>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'blue' }}>
            Register
          </Link>
        </Text>
        <Text>
          <Link to="/forgot-uid" style={{ color: 'blue' }}>
            Forgot UID?
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default Login 