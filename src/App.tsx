import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { QuestionListPage } from "./pages/QuestionListPage";
import { QuestionDetailsPage } from "./pages/QuestionDetailsPage";
import { useEffect, useState } from "react";
import { theme } from "./styles/theme";
import { SearchBar } from "./components/SearchBar";
import Logo from "../assets/stackoverflow-logo.png";
import UserPlaceholder from "../assets/user-placeholder.jpeg";

export function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    window.Main.on("stackexchange:on-auth", ({ token }: any) => {
      localStorage.setItem("token", token);
      setIsAuthorized(true);
    });
  }, []);

  if (!isAuthorized) {
    return <Spinner />;
  }

  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Center
          bgColor="gray.800"
          h="40px"
          css={{ "-webkit-app-region": "drag" }}
        >
          <Box justifySelf="flex-start" flex={1} />
          <Box flex={1}>
            <SearchBar />
          </Box>
          <Box justifySelf="flex-end" flex={1}>
            <Image
              src={UserPlaceholder}
              boxSize="25px"
              objectFit="cover"
              borderRadius="5px"
              ml="auto"
              mr="10px"
            />
          </Box>
        </Center>
        <Flex h="calc(100vh - 40px)" alignItems={"stretch"}>
          <Box
            bgColor="gray.700"
            color="white"
            flex={"0 0 250px"}
            overflow={"auto"}
            p="16px"
          >
            <Center>
              <Image src={Logo} h="25px" />
            </Center>
          </Box>
          <Box overflow={"auto"} p="16px" w="100%">
            <Switch>
              <Route path="/" exact component={QuestionListPage} />
              <Route path="/questions/:id" component={QuestionDetailsPage} />
            </Switch>
          </Box>
        </Flex>
      </ChakraProvider>
    </Router>
  );
}
