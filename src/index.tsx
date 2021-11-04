import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { App } from './App';
import { theme } from './styles/theme';
import { HashRouter as Router } from 'react-router-dom';
import React from 'react';

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <React.StrictMode>
      <Router>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Router>
    </React.StrictMode>
  </>,
  document.getElementById('root')
);
