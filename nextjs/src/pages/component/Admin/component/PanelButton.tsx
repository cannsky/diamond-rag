import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface PanelButtonProps {
    text: string;
    icon: IconType;
    color?: string;
    onClick: () => void;
}

const PanelButton : React.FC<PanelButtonProps> = ({ text, icon, color = 'white', onClick }) => {
    return(
        <Box
            p={5}
            bg='gray.780'
            borderRadius='md'
            border='2px'
            borderColor='gray.720'
            cursor='pointer'
            _hover={{ bg: 'gray.720' }}
            onClick={onClick}
            >
                <Icon as={icon} boxSize={4} mb={2} color={color} />
                <Text fontSize='sm' color='gray.100'>{text}</Text>
            </Box>
    )
}

export default PanelButton;