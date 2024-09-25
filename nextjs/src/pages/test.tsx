import { ChakraProvider, Flex } from '@chakra-ui/react';
import { checkAuth } from './utility/utility';
import Test from './component/Test/Test';
import Header from './component/Header/Header'
import ChatContainer from './component/ChatContainer';
import customTheme from './theme/theme';
import { UserSession } from './utility/interface/userSession';

export const getServerSideProps = checkAuth;

interface HomeProps { session: UserSession; };

export default function Home({ session } : HomeProps) {
    return (
        <main>
            <ChakraProvider theme={customTheme}>
                <Flex h='100vh'>
                    <Flex flex='0 1 17%'>
                        <Header session= {session} />
                    </Flex>
                    <Flex flex='1 1 83%'>
                        <Test />
                    </Flex>
                </Flex>
            </ChakraProvider>
        </main>
    )
}