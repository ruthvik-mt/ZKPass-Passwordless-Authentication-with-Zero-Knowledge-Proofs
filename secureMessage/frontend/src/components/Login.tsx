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
  Container,
  Divider,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'

export const Login: React.FC = () => {
  const [uid, setUid] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, error } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(uid)
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/encoder')
    } catch (err) {
      toast({
        title: 'Login failed',
        description: error || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Welcome to Secure Message</Heading>
        <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>User ID</FormLabel>
                <Input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="Enter your User ID"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
              >
                Login
              </Button>
              <Divider />
              <Button
                onClick={() => navigate('/register')}
                colorScheme="green"
                width="100%"
              >
                Register New Account
              </Button>
              <Text textAlign="center">
                <Link 
                  to="/recovery"
                  color="blue.500" 
                  _hover={{ textDecoration: 'underline' }}
                >
                  Forgot your UID?
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  )
} 