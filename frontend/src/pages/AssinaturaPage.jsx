import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import axios from "axios";

function AssinaturaPage() {
  const [step, setStep] = useState("login"); // login, register, sign
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  // Persistência do login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("id");

    if (token && name && id) {
      setUser({ id, name, token });
      setStep("sign");
    }
  }, []);

  // --- Função de login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(25);
    try {
      setProgress(50);
      const res = await axios.post("http://localhost:4000/api/login", {
        email: form.email,
        password: form.password,
      });
      setProgress(75);
      setUser(res.data);

      // salvar no localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("id", res.data.id);

      setStep("sign");
      setProgress(100);
      toast({
        title: "Login realizado!",
        description: "Agora você pode assinar documentos.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error.response?.data?.error || "Tente novamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  // --- Função de registro ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(25);

    try {
      setProgress(50);
      const res = await axios.post("http://localhost:4000/api/register", form);
      setProgress(75);
      setUser(res.data);

      // salvar no localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("id", res.data.id);

      setStep("sign");
      setProgress(100);
      toast({
        title: "Cadastro realizado!",
        description: "Agora você pode assinar documentos.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: error.response?.data?.error || "Tente novamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  // --- Função de assinatura ---
  const handleSign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(25);

    try {
      setProgress(50);
      const res = await axios.post(
        "http://localhost:4000/api/sign",
        { text, userId: user.id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setProgress(75);

      toast({
        title: "Assinatura criada!",
        description: `ID: ${res.data.signatureId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setProgress(100);
      setTimeout(() => {
        navigate(`/verify/${res.data.signatureId}`);
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro na assinatura",
        description: error.response?.data?.error || "Tente novamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Tem certeza que deseja cancelar? Todo o progresso será perdido."
      )
    ) {
      setStep("login");
      setUser(null);
      setForm({ name: "", email: "", password: "" });
      setText("");
      setProgress(0);
      localStorage.clear();
    }
  };

  return (
    <Box minH='100vh' bg='gray.50' py={10}>
      <VStack spacing={6} maxW='md' mx='auto' px={4}>
        <Heading as='h1' size='xl' textAlign='center' color='brand.500'>
          FabioSign
        </Heading>

        {progress > 0 && (
          <Box w='full'>
            <Progress value={progress} colorScheme='brand' size='lg' />
            <Text mt={2} textAlign='center' color='gray.600'>
              Processando... {progress}%
            </Text>
          </Box>
        )}

        <Alert status='warning'>
          <AlertIcon />
          <Box>
            <Text fontWeight='bold'>Modo Seguro Ativado</Text>
            <Text fontSize='sm'>
              Esta tela não permite interrupções. Complete o processo ou cancele
              completamente.
            </Text>
          </Box>
        </Alert>

        {/* --- LOGIN --- */}
        {step === "login" && (
          <Box p={6} bg='white' borderRadius='lg' boxShadow='lg' w='full'>
            <VStack spacing={4}>
              <Heading as='h2' size='lg' textAlign='center'>
                Login
              </Heading>
              <form onSubmit={handleLogin} style={{ width: "100%" }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type='email'
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder='Digite seu email'
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input
                      type='password'
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder='Digite sua senha'
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type='submit'
                    colorScheme='brand'
                    width='full'
                    isLoading={isLoading}
                    loadingText='Entrando...'
                  >
                    Entrar
                  </Button>
                  <Button variant='link' onClick={() => setStep("register")}>
                    Não tem conta? Registre-se
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        )}

        {/* --- REGISTRO --- */}
        {step === "register" && (
          <Box p={6} bg='white' borderRadius='lg' boxShadow='lg' w='full'>
            <VStack spacing={4}>
              <Heading as='h2' size='lg' textAlign='center'>
                Cadastro Seguro
              </Heading>
              <form onSubmit={handleRegister} style={{ width: "100%" }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      type='text'
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder='Digite seu nome'
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type='email'
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder='Digite seu email'
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input
                      type='password'
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder='Digite sua senha'
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type='submit'
                    colorScheme='brand'
                    width='full'
                    isLoading={isLoading}
                    loadingText='Registrando...'
                  >
                    Registrar
                  </Button>
                  <Button variant='link' onClick={() => setStep("login")}>
                    Já tem conta? Faça login
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        )}

        {/* --- ASSINATURA --- */}
        {step === "sign" && user && (
          <Box p={6} bg='white' borderRadius='lg' boxShadow='lg' w='full'>
            <Heading as='h2' size='lg' mb={4}>
              Olá, {user.name}!
            </Heading>
            <form onSubmit={handleSign}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Texto para assinar</FormLabel>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Digite o texto aqui...'
                    isDisabled={isLoading}
                  />
                </FormControl>
                <Button
                  type='submit'
                  colorScheme='brand'
                  width='full'
                  isLoading={isLoading}
                  loadingText='Assinando...'
                >
                  Assinar
                </Button>
                <Button
                  variant='outline'
                  colorScheme='red'
                  onClick={handleCancel}
                >
                  Sair / Logout
                </Button>
              </VStack>
            </form>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default AssinaturaPage;
