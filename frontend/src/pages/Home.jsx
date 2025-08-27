import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaFileSignature, FaCheckCircle, FaDownload } from 'react-icons/fa';

function Home() {
  const bg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bg} py={10}>
      <VStack spacing={8} maxW="1200px" mx="auto" px={4}>
        <Heading as="h1" size="2xl" textAlign="center" color="brand.500">
          FabioSign
        </Heading>
        <Text fontSize="xl" textAlign="center" color="gray.600" maxW="600px">
          Plataforma segura para assinatura digital de documentos com criptografia RSA e SHA-256.
        </Text>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} w="full" maxW="900px">
          <GridItem>
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
              textAlign="center"
              _hover={{ transform: 'translateY(-5px)', transition: '0.3s' }}
              as={Link}
              to="/assinatura"
              display="block"
            >
              <Icon as={FaFileSignature} w={12} h={12} color="brand.500" mb={4} />
              <Heading size="md" mb={2}>Assinar Documentos</Heading>
              <Text color="gray.600">Crie assinaturas digitais seguras para seus textos.</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
              textAlign="center"
              _hover={{ transform: 'translateY(-5px)', transition: '0.3s' }}
              as={Link}
              to="/verify"
              display="block"
            >
              <Icon as={FaCheckCircle} w={12} h={12} color="green.500" mb={4} />
              <Heading size="md" mb={2}>Verificar Assinaturas</Heading>
              <Text color="gray.600">Confirme a validade de assinaturas existentes.</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
              textAlign="center"
              _hover={{ transform: 'translateY(-5px)', transition: '0.3s' }}
              as={Link}
              to="/download"
              display="block"
            >
              <Icon as={FaDownload} w={12} h={12} color="blue.500" mb={4} />
              <Heading size="md" mb={2}>Baixar Documentos</Heading>
              <Text color="gray.600">Exporte seus documentos assinados em PDF.</Text>
            </Box>
          </GridItem>
        </Grid>

        <Button as={Link} to="/assinatura" colorScheme="brand" size="lg">
          Começar Agora
        </Button>
      </VStack>
    </Box>
  );
}

export default Home;
