import ReactDOM from 'react-dom';
import { ColorModeScript } from '@chakra-ui/react';
import { App } from './App';
import { theme } from './styles/theme';

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>,
  document.getElementById('root')
);
