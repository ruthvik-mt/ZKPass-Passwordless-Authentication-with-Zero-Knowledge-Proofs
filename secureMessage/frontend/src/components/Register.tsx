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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import axios from 'axios'

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void
}

const Register = ({ setIsAuthenticated }: RegisterProps) => {
  const [uid, setUid] = useState('')
  const [recoveryPhrase, setRecoveryPhrase] = useState('')
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        uid,
      })
      if (response.data.success) {
        setRecoveryPhrase(response.data.recoveryPhrase)
        setShowRecoveryPhrase(true)
        toast({
          title: 'Success',
          description: response.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Registration failed. UID might be taken.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleContinue = () => {
    navigate('/login')
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Heading>Register</Heading>
        {!showRecoveryPhrase ? (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>UID</FormLabel>
                <Input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="Choose your UID"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="100%">
                Register
              </Button>
            </VStack>
          </form>
        ) : (
          <VStack spacing={4} width="100%">
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Registration Successful!</AlertTitle>
                <AlertDescription>
                  Your recovery phrase is: <strong>{recoveryPhrase}</strong>
                  <br />
                  Please save this phrase. You'll need it if you forget your UID.
                </AlertDescription>
              </Box>
            </Alert>
            <Button onClick={handleContinue} colorScheme="blue" width="100%">
              Continue to Login
            </Button>
          </VStack>
        )}
        <Text>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'blue' }}>
            Login
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default Register 