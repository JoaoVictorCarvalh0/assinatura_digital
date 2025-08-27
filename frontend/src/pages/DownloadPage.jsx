import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

function DownloadPage() {
  const [signatureId, setSignatureId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!signatureId.trim()) {
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
      // Placeholder: implementar download de PDF
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'Download de PDF será implementado em breve.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro no download',
        description: 'Não foi possível baixar o documento.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="lg" boxShadow="lg">
      <VStack spacing={4}>
        <Heading as="h1" size="xl" textAlign="center" color="brand.500">
          FabioSign
        </Heading>
        <Heading as="h2" size="lg" textAlign="center">
          Baixar Documento
        </Heading>
        <Alert status="info">
          <AlertIcon />
          Esta funcionalidade será implementada para gerar PDFs dos documentos assinados.
        </Alert>
        <form onSubmit={handleDownload} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>ID da Assinatura</FormLabel>
              <Input
                value={signatureId}
                onChange={(e) => setSignatureId(e.target.value)}
                placeholder="Digite o ID da assinatura"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              isLoading={isLoading}
              loadingText="Gerando PDF..."
            >
              Baixar PDF
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

export default DownloadPage;
