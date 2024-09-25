import { ChakraProvider, Flex } from '@chakra-ui/react';
import UserRegister from './component/UserRegister';
import customTheme from './theme/theme';

export default function Home() {
    return (
        <main>
            <ChakraProvider theme={customTheme}>
                <Flex h='100vh'>
                    <Flex flex='0 1 100%'>
                        <UserRegister />
                    </Flex>
                </Flex>
            </ChakraProvider>
        </main>
    )
}