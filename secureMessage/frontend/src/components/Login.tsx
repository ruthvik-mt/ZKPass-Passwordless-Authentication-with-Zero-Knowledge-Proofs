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
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'

export const Login: React.FC = () => {
  const [uid, setUid] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, register, error } = useAuth()
  const toast = useToast()

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

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      const recoveryPhrase = await register(uid)
      toast({
        title: 'Registration successful',
        description: `Please save your recovery phrase: ${recoveryPhrase}`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Registration failed',
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
              <Text>or</Text>
              <Button
                onClick={handleRegister}
                colorScheme="green"
                width="100%"
                isLoading={isLoading}
              >
                Register New Account
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  )
} 