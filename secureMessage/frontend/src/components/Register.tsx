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

export const Register: React.FC = () => {
  const [uid, setUid] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { register, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      navigate('/encoder')
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
        <Heading>Register New Account</Heading>
        <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>User ID</FormLabel>
                <Input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="Choose your User ID"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
              >
                Register
              </Button>
              <Text>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  color="blue.500"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Login
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  )
} 