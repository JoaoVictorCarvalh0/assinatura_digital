import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  useToast,
  Text,
  Alert,
  AlertIcon,
  Progress,
} from '@chakra-ui/react';
import axios from 'axios';

function AssinaturaPage() {
  const [step, setStep] = useState('register'); // register, sign
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(25);

    try {
      setProgress(50);
      const res = await axios.post('http://localhost:4000/api/register', form);
      setProgress(75);
      setUser(res.data);
      setStep('sign');
      setProgress(100);
      toast({
        title: 'Cadastro realizado!',
        description: 'Agora você pode assinar documentos.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro no cadastro',
        description: error.response?.data?.error || 'Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleSign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(25);

    try {
      setProgress(50);
      const res = await axios.post('http://localhost:4000/api/sign', {
        userId: user.id,
        text
      });
      setProgress(75);

      toast({
        title: 'Assinatura criada!',
        description: `ID: ${res.data.signatureId}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setProgress(100);
      // Redirecionar para verificação após um delay
      setTimeout(() => {
        navigate(`/verify/${res.data.signatureId}`);
      }, 2000);

    } catch (error) {
      toast({
        title: 'Erro na assinatura',
        description: error.response?.data?.error || 'Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Todo o progresso será perdido.')) {
      setStep('register');
      setUser(null);
      setForm({ name: '', email: '', password: '' });
      setText('');
      setProgress(0);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <VStack spacing={6} maxW="md" mx="auto" px={4}>
        <Heading as="h1" size="xl" textAlign="center" color="brand.500">
          FabioSign
        </Heading>

        {progress > 0 && (
          <Box w="full">
            <Progress value={progress} colorScheme="brand" size="lg" />
            <Text mt={2} textAlign="center" color="gray.600">
              Processando... {progress}%
            </Text>
          </Box>
        )}

        <Alert status="warning">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Modo Seguro Ativado</Text>
            <Text fontSize="sm">
              Esta tela não permite interrupções. Complete o processo ou cancele completamente.
            </Text>
          </Box>
        </Alert>

        {step === 'register' && (
          <Box p={6} bg="white" borderRadius="lg" boxShadow="lg" w="full">
            <VStack spacing={4}>
              <Heading as="h2" size="lg" textAlign="center">
                Cadastro Seguro
              </Heading>
              <form onSubmit={handleRegister} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Digite seu nome"
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Digite seu email"
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Digite sua senha"
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Registrando..."
                  >
                    Registrar e Continuar
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        )}

        {step === 'sign' && (
          <Box p={6} bg="white" borderRadius="lg" boxShadow="lg" w="full">
            <VStack spacing={4}>
              <Heading as="h2" size="lg" textAlign="center">
                Assinar Documento
              </Heading>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Bem-vindo, {user?.name}! Digite o texto que deseja assinar.
              </Text>
              <form onSubmit={handleSign} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Texto para assinar</FormLabel>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Digite o texto aqui..."
                      rows={6}
                      resize="vertical"
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    width="full"
                    isLoading={isLoading}
                    loadingText="Assinando..."
                  >
                    Assinar Documento
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    width="full"
                    onClick={handleCancel}
                    isDisabled={isLoading}
                    colorScheme="red"
                  >
                    Cancelar Processo
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default AssinaturaPage;
