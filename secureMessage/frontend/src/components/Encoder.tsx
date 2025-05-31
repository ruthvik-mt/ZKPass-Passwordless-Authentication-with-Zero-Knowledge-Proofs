import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Textarea,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { ZKPassClient } from 'zkpass-sdk';

export const Encoder: React.FC = () => {
  const [message, setMessage] = useState('');
  const [encodedMessage, setEncodedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const toast = useToast();
  const sdk = new ZKPassClient({
    baseURL: 'http://localhost:3000',
  });

  const handleEncode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sdk.encodeMessage(message);
      setEncodedMessage(response.encodedMessage);
      toast({
        title: 'Message encoded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Encoding failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encodedMessage);
    toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Message Encoder</Heading>
        <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
          <form onSubmit={handleEncode}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Message to Encode</FormLabel>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                  rows={4}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
              >
                Encode Message
              </Button>
            </VStack>
          </form>

          {encodedMessage && (
            <VStack spacing={4} mt={8}>
              <FormControl>
                <FormLabel>Encoded Message</FormLabel>
                <Box
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg="gray.50"
                  position="relative"
                >
                  <Text fontFamily="mono" whiteSpace="pre-wrap">
                    {encodedMessage}
                  </Text>
                  <Button
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={handleCopy}
                  >
                    Copy
                  </Button>
                </Box>
              </FormControl>
            </VStack>
          )}

          <Button
            mt={8}
            colorScheme="red"
            variant="outline"
            width="100%"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}; 