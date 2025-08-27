import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Tema customizado para acessibilidade e aparência agradável
const theme = extendTheme({
  colors: {
    brand: {
      500: '#667eea',
      600: '#5a67d8',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        _focus: { boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.6)' },
      },
    },
    Input: {
      baseStyle: {
        field: {
          _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #667eea' },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
