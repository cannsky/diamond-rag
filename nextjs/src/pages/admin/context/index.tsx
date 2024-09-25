import { ChakraProvider, Flex } from '@chakra-ui/react';
import { checkAuth } from '../../utility/utility';
import Header from '../../component/Header/Header';
import customTheme from '../../theme/theme';
import ContextPanel from '../../component/Admin/ContextPanel/ContextPanel';
import { UserSession } from '../../utility/interface/userSession';

//export const getServerSideProps = checkAuth;

interface ContextProps { session: UserSession; };

export default function Context({ session } : ContextProps) {
    return (
        <main>
            <ChakraProvider theme={customTheme}>
                <Flex h='100vh'>
                    <Flex flex='0 1 17%'>
                        <Header session= {session} />
                    </Flex>
                    <Flex flex='1 1 83%'>
                        <ContextPanel />
                    </Flex>
                </Flex>
            </ChakraProvider>
        </main>
    )
}