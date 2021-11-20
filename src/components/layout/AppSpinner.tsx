import { Center, useColorModeValue } from '@chakra-ui/react';
import { memo, useLayoutEffect } from 'react';
import { renderLoader } from '../../uitls/render-loader';

export const AppSpinner = memo(() => {
  const color = useColorModeValue(0x2d3748, 0xffffff);

  useLayoutEffect(() => {
    const containerEl = document.getElementById('app-loader-container');

    if (containerEl) {
      renderLoader({
        element: containerEl!,
        width: 200,
        height: 200,
        color
      });
    }
  });

  return <Center id="app-loader-container" h="100%"></Center>;
});
