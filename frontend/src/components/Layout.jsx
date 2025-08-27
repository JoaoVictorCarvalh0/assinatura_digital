import React from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <Box>
      <Sidebar />
      <Box ml="250px" minH="100vh" bg="gray.50">
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
