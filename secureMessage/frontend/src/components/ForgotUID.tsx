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

interface ForgotUIDProps {
  setIsAuthenticated: (value: boolean) => void
}

const ForgotUID = ({ setIsAuthenticated }: ForgotUIDProps) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState('')
  const [recoveredUID, setRecoveredUID] = useState('')
  const [showRecoveredUID, setShowRecoveredUID] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/auth/recover', {
        recoveryPhrase,
      })
      if (response.data.success) {
        setRecoveredUID(response.data.uid)
        setShowRecoveredUID(true)
        toast({
          title: 'Success',
          description: 'UID recovered successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid recovery phrase',
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
        <Heading>Recover UID</Heading>
        {!showRecoveredUID ? (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Recovery Phrase</FormLabel>
                <Input
                  type="text"
                  value={recoveryPhrase}
                  onChange={(e) => setRecoveryPhrase(e.target.value)}
                  placeholder="Enter your recovery phrase"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="100%">
                Recover
              </Button>
            </VStack>
          </form>
        ) : (
          <VStack spacing={4} width="100%">
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>UID Recovered!</AlertTitle>
                <AlertDescription>
                  Your UID is: <strong>{recoveredUID}</strong>
                  <br />
                  Please use this UID to login.
                </AlertDescription>
              </Box>
            </Alert>
            <Button onClick={handleContinue} colorScheme="blue" width="100%">
              Continue to Login
            </Button>
          </VStack>
        )}
        <Text>
          <Link to="/login" style={{ color: 'blue' }}>
            Back to Login
          </Link>
        </Text>
      </VStack>
    </Box>
  )
}

export default ForgotUID 