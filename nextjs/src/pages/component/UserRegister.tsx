import { Flex, Box, Button, FormControl, FormLabel, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';

const UserRegister: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const result = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (result?.ok) {
            toast({
                title: 'Logged in',
                status: 'success',
                duration: 9000,
                isClosable: true
            });

            router.push('/login');
        } else {
            toast({
                title: 'An error occured',
                description: result.statusText,
                status: 'error',
                duration: 9000,
                isClosable: true
            });
        }
    }

    return (
        <Flex w='100%'>
            <Flex w='100%' display='flex' alignItems='center' justifyContent='center' h='100vh' bg='gray.780'>
                <Box p={8} maxW='400px' borderWidth={1} borderRadius={8} borderColor='gray.720' boxShadow='lg' bg='gray.750'>
                    <Text fontSize='xl' color='white' mb={4} textAlign='center'>Login</Text>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4} color='white'>
                            <FormControl>
                                <Box>
                                    <FormLabel>Username</FormLabel>
                                </Box>
                                <Input bg='gray.720' color='white' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <Box>
                                    <FormLabel>Password</FormLabel>
                                </Box>
                                <Input bg='gray.720' color='white' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </FormControl>
                            <Button type='submit' colorScheme='blue' width='full'>Login</Button>
                        </Stack>
                    </form>
                    {error && <Text color='red.500' mt={2}>{error}</Text>}
                </Box>
            </Flex>
        </Flex>
    )
}

export default UserRegister;