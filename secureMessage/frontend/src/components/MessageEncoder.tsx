import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Text,
  useToast,
  Textarea,
} from '@chakra-ui/react'
import axios from 'axios'

interface MessageEncoderProps {
  setIsAuthenticated: (value: boolean) => void
}

const MessageEncoder = ({ setIsAuthenticated }: MessageEncoderProps) => {
  const [message, setMessage] = useState('')
  const [encodedMessage, setEncodedMessage] = useState('')
  const [method, setMethod] = useState('base64')
  const [isEncoding, setIsEncoding] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/encode', {
        message,
        method,
        isEncoding,
      })
      setEncodedMessage(response.data.result)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Heading>Message Encoder/Decoder</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                rows={4}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Method</FormLabel>
              <Select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="base64">Base64</option>
                <option value="caesar">Caesar Cipher</option>
                <option value="rot13">ROT13</option>
              </Select>
            </FormControl>
            <Button
              type="button"
              onClick={() => setIsEncoding(!isEncoding)}
              colorScheme="gray"
              width="100%"
            >
              Switch to {isEncoding ? 'Decode' : 'Encode'}
            </Button>
            <Button type="submit" colorScheme="blue" width="100%">
              {isEncoding ? 'Encode' : 'Decode'}
            </Button>
          </VStack>
        </form>
        {encodedMessage && (
          <Box width="100%" p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">Result:</Text>
            <Text mt={2}>{encodedMessage}</Text>
          </Box>
        )}
        <Button
          onClick={handleLogout}
          colorScheme="red"
          variant="outline"
          width="100%"
        >
          Logout
        </Button>
      </VStack>
    </Box>
  )
}

export default MessageEncoder 