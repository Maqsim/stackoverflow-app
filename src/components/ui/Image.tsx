import { Image as ChakraImage } from '@chakra-ui/react';

type Props = {
  src: string;
};

export function Image({ src }: Props) {
  function openInPreview() {
    window.Main.openImageInPreview(src);
  }

  return <ChakraImage src={src} cursor="pointer" onClick={openInPreview} />;
}
