import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface PanelSubmitProps {
    text?: string;
    onClick: () => void;
}

const PanelSubmit: React.FC<PanelSubmitProps> = ({ text, onClick }) => {
    return (
        <Box>
            <Button colorScheme="orange" onClick={onClick}>
                {text}
            </Button>
        </Box>
    );
}

export default PanelSubmit;