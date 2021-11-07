import { useEffect, useState } from 'react';
import { Text, TextProps } from '@chakra-ui/react';

type Props = {
  children: string;
} & TextProps;

export function EllipsisLoader(props: Props) {
  const [iteration, setIteration] = useState(1);

  useEffect(() => {
    let timerId: NodeJS.Timer;

    timerId = setTimeout(() => {
      // console.log(iteration);
      if (iteration === 3) {
        setIteration(1);
      } else {
        setIteration(iteration + 1);
      }
    }, 200);

    return () => clearTimeout(timerId);
  }, [iteration]);

  return <Text {...props}>{props.children + [...Array(iteration)].map(() => '.').join('')}</Text>;
}
