import { Box, Text, VStack } from '@chakra-ui/react';
import { UserSession } from '../../utility/interface/userSession';
import HeaderButton from './component/HeaderButton';
import { useRouter } from 'next/router';

interface HeaderProps { session: UserSession };

const Header : React.FC<HeaderProps> = ({ session }) => {

    const router = useRouter();

    const handleRouting = (route: string) => {
        router.push(route);
    }

    return (
        <Box w='100%' bg='gray.780' color='white'>
            <Text fontSize='2xl'>Diamond AI</Text>
            {session && session.user && (
                <Text fontSize='sm'> User: <strong>{session.user.name}</strong> </Text>
            )}
            <VStack w='100%' spacing={2} align='stretch'>
                <HeaderButton text='Main Page' onClick={() => handleRouting('/')} />
                <HeaderButton text='Admin' onClick={() => handleRouting('/admin')} />
            </VStack>
        </Box>
    )
}

export default Header;