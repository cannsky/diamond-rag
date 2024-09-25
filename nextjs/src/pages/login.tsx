import { ChakraProvider, Flex } from '@chakra-ui/react';
import { checkLoginRegisterAuth } from './utility/utility';
import UserAuth from './component/UserAuth';
import customTheme from './theme/theme';

export const getServerSideProps = checkLoginRegisterAuth;

export default function Home() {
    return (
        <main>
            <ChakraProvider theme={customTheme}>
                <Flex h='100vh'>
                    <Flex flex='0 1 100%'>
                        <UserAuth />
                    </Flex>
                </Flex>
            </ChakraProvider>
        </main>
    )
}