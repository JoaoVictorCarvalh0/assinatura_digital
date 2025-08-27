import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';

function VerificacaoPage() {
  const { id: urlId } = useParams();
  const [signatureId, setSignatureId] = useState(urlId || '');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (urlId) {
      setSignatureId(urlId);
      handleVerify(urlId);
    }
  }, [urlId]);

  const handleVerify = async (id = signatureId) => {
    if (!id.trim()) {
      toast({
        title: 'ID necessário',
        description: 'Digite o ID da assinatura.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/verify/${id}`);
      setVerifyResult(res.data);
      toast({
        title: res.data.status === 'VÁLIDA' ? 'Assinatura válida!' : 'Assinatura inválida!',
        status: res.data.status === 'VÁLIDA' ? 'success' : 'error',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      toast({
        title: 'Erro na verificação',
        description: error.response?.data?.error || 'Verifique se o backend está rodando.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleVerify();
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="lg" boxShadow="lg">
      <VStack spacing={4}>
        <Heading as="h1" size="xl" textAlign="center" color="brand.500">
          FabioSign
        </Heading>
        <Heading as="h2" size="lg" textAlign="center">
          Verificar Assinatura
        </Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>ID da Assinatura</FormLabel>
              <Input
                value={signatureId}
                onChange={(e) => setSignatureId(e.target.value)}
                placeholder="Cole o ID da assinatura"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              isLoading={isLoading}
              loadingText="Verificando..."
            >
              Verificar
            </Button>
          </VStack>
        </form>
        {verifyResult && (
          <>
            <Divider />
            <Alert status={verifyResult.status === 'VÁLIDA' ? 'success' : 'error'}>
              <AlertIcon />
              <Box>
                <AlertTitle>Status: {verifyResult.status}</AlertTitle>
                <AlertDescription>
                  <Text><strong>Signatário:</strong> {verifyResult.signatario}</Text>
                  <Text><strong>Algoritmo:</strong> {verifyResult.algoritmo}</Text>
                  <Text><strong>Data/Hora:</strong> {new Date(verifyResult.dataHora).toLocaleString('pt-BR')}</Text>
                </AlertDescription>
              </Box>
            </Alert>
          </>
        )}
      </VStack>
    </Box>
  );
}

export default VerificacaoPage;
