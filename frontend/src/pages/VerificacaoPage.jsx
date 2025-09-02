import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";

function VerificacaoPage() {
  const { id: urlId } = useParams();
  const [signatureId, setSignatureId] = useState(urlId || "");
  const [text, setText] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (urlId) {
      setSignatureId(urlId);
      handleVerifyById(urlId);
    }
  }, [urlId]);

  // Função genérica para atualizar verifyResult mesmo em erro
  const updateVerifyResultError = (errorMessage) => {
    setVerifyResult({
      status: "INVÁLIDA",
      signatario: "-",
      algoritmo: "-",
      dataHora: "-",
      error: errorMessage,
    });
  };

  // Verificação por ID
  const handleVerifyById = async (id = signatureId) => {
    if (!id.trim()) {
      updateVerifyResultError("Digite o ID da assinatura.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/verify/${id}`);
      setVerifyResult(res.data);
    } catch (error) {
      console.error("Erro na verificação:", error);
      updateVerifyResultError(
        error.response?.data?.error || "Assinatura não encontrada."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Verificação por Texto + Assinatura
  const handleVerifyByText = async () => {
    if (!text.trim() || !signatureText.trim()) {
      updateVerifyResultError("Preencha texto e assinatura.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/verify-text", {
        text,
        signatureBase64: signatureText,
      });
      setVerifyResult(res.data);
    } catch (error) {
      console.error("Erro na verificação:", error);
      updateVerifyResultError(
        error.response?.data?.error || "Assinatura inválida ou não encontrada."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW='6xl'
      mx='auto'
      mt={10}
      p={6}
      bg='white'
      borderRadius='lg'
      boxShadow='lg'
    >
      <VStack spacing={6}>
        <Heading as='h1' size='xl' textAlign='center' color='brand.500'>
          FabioSign
        </Heading>
        <Heading as='h2' size='lg' textAlign='center'>
          Verificar Assinatura
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} width='100%'>
          {/* Verificação por ID */}
          <Box p={4} borderWidth={1} borderRadius='md' borderColor='gray.200'>
            <Heading as='h3' size='md' mb={4}>
              Por ID da Assinatura
            </Heading>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyById();
              }}
            >
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>ID da Assinatura</FormLabel>
                  <Input
                    value={signatureId}
                    onChange={(e) => setSignatureId(e.target.value)}
                    placeholder='Cole o ID da assinatura'
                  />
                </FormControl>
                <Button
                  type='submit'
                  colorScheme='brand'
                  width='full'
                  isLoading={isLoading}
                  loadingText='Verificando...'
                >
                  Verificar por ID
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Verificação por Texto + Assinatura */}
          <Box p={4} borderWidth={1} borderRadius='md' borderColor='gray.200'>
            <Heading as='h3' size='md' mb={4}>
              Por Texto + Assinatura
            </Heading>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Texto</FormLabel>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Cole o texto assinado'
                  rows={4}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Assinatura (Base64)</FormLabel>
                <Textarea
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder='Cole a assinatura em Base64'
                  rows={4}
                />
              </FormControl>
              <Button
                onClick={handleVerifyByText}
                colorScheme='brand'
                width='full'
                isLoading={isLoading}
                loadingText='Verificando...'
              >
                Verificar
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Resultado */}
        {verifyResult && (
          <>
            <Divider />
            <Alert
              status={verifyResult.status === "VÁLIDA" ? "success" : "error"}
            >
              <AlertIcon />
              <Box>
                <AlertTitle>Status: {verifyResult.status}</AlertTitle>
                <AlertDescription>
                  <Text>
                    <strong>Signatário:</strong> {verifyResult.signatario}
                  </Text>
                  <Text>
                    <strong>Algoritmo:</strong> {verifyResult.algoritmo}
                  </Text>
                  <Text>
                    <strong>Data/Hora:</strong>{" "}
                    {verifyResult.dataHora !== "-"
                      ? new Date(verifyResult.dataHora).toLocaleString("pt-BR")
                      : "-"}
                  </Text>
                  {verifyResult.error && (
                    <Text color='red.500'>
                      <strong>Erro:</strong> {verifyResult.error}
                    </Text>
                  )}
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
