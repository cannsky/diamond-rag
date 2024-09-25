import { ChakraProvider, Flex } from '@chakra-ui/react';
import { checkAuth } from '../../utility/utility';
import Header from '../../component/Header/Header';
import customTheme from '../../theme/theme';
import PredefinedPromptPanel from '../../component/Admin/PredefinedPromptPanel';
import { UserSession } from '../../utility/interface/userSession';

//export const getServerSideProps = checkAuth;

interface PredefinedPromptProps { session: UserSession; };

export default function PredefinedPrompt({ session } : PredefinedPromptProps) {
    return (
        <main>
            <ChakraProvider theme={customTheme}>
                <Flex h='100vh'>
                    <Flex flex='0 1 17%'>
                        <Header session= {session} />
                    </Flex>
                    <Flex flex='1 1 83%'>
                        <PredefinedPromptPanel />
                    </Flex>
                </Flex>
            </ChakraProvider>
        </main>
    )
}