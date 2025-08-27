import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Button,
  Text,
  Divider,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaHome, FaCheckCircle, FaDownload, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    // Limpar dados do usuário se necessário
    navigate('/');
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/verify', label: 'Verificar', icon: FaCheckCircle },
    { path: '/download', label: 'Baixar', icon: FaDownload },
  ];

  return (
    <Box
      w="250px"
      h="100vh"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      position="fixed"
      left={0}
      top={0}
      zIndex={1000}
      boxShadow="lg"
    >
      <VStack spacing={4} align="stretch" h="full" p={4}>
        <Box textAlign="center" py={4}>
          <Text fontSize="xl" fontWeight="bold" color="brand.500">
            FabioSign
          </Text>
        </Box>

        <Divider />

        <VStack spacing={2} align="stretch" flex={1}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              as={Link}
              to={item.path}
              variant={location.pathname === item.path ? 'solid' : 'ghost'}
              colorScheme={location.pathname === item.path ? 'brand' : 'gray'}
              justifyContent="flex-start"
              leftIcon={<Icon as={item.icon} />}
              w="full"
            >
              {item.label}
            </Button>
          ))}
        </VStack>

        <Divider />

        <VStack spacing={2} align="stretch">
          <Button
            as={Link}
            to="/assinatura"
            colorScheme="green"
            leftIcon={<Icon as={FaHome} />}
            w="full"
          >
            Nova Assinatura
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            colorScheme="red"
            leftIcon={<Icon as={FaSignOutAlt} />}
            w="full"
          >
            Sair
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}

export default Sidebar;
