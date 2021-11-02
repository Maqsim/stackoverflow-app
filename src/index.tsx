import ReactDOM from 'react-dom';
import { ColorModeScript } from '@chakra-ui/react';
import { App } from './App';
import { theme } from './styles/theme';
import React from 'react';

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </>,
  document.getElementById('root')
);
