import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Link
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export const RecoveryPhrase: React.FC = () => {
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyRecovery, error } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyRecovery(recoveryPhrase);
      toast({
        title: 'Recovery successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/encoder');
    } catch (err) {
      toast({
        title: 'Recovery failed',
        description: error || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Recover Your Account</Heading>
        <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
          <form onSubmit={handleVerify}>
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
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
              >
                Verify Recovery Phrase
              </Button>
              <Text textAlign="center">
                <Link 
                  color="blue.500" 
                  onClick={() => navigate('/login')}
                  _hover={{ textDecoration: 'underline' }}
                >
                  Back to Login
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}; 