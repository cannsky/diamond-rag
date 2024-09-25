import { Box, Button } from '@chakra-ui/react';

interface HeaderButtonProps {
    text: string;
    onClick: () => void;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ text, onClick }) => {
    return (
        <Box w='100%' p={2} bg='gray.780' color='white'>
            <Button 
                bg='gray.750'
                color='white'
                w='100%'
                _hover={{ bg: 'gray.720' }}
                onClick={onClick}>
                    {text}
            </Button>
        </Box>
    );
}

export default HeaderButton;