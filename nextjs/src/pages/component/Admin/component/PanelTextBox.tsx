import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Icon, Textarea } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface PanelTextBoxProps {
    placeholder: string;
    icon?: any;
    color?: string;
    onChange: (value: string) => void;
}

const PanelTextBox : React.FC<PanelTextBoxProps> = ({ placeholder, icon, color = 'white', onChange }) => {
    const [value, setValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    }

    const handleFocus = () => {
        setIsEditing(true);
    }

    const handleBlur = () => {
        setIsEditing(false);
    }

    return(
        <Box w='70%' position='relative'>
            { icon && 
                <Box position='absolute' top='40%' left='0.75rem' transform='translateY(-50%)' zIndex={2}>
                    <Icon 
                        as={icon} 
                        boxSize={5} 
                        color={isEditing ? 'orange' : color} 
                    />
                </Box>
            }
            <Textarea
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                size='md'
                resize='none'
                bg='gray.720'
                color='white'
                border='none'
                minH='10px'
                maxH='200px'
                overflow='hidden'
                lineHeight='1.2'
                p='2'
                placeholder={placeholder}
                _placeholder={{ color: 'gray.400' }} 
                paddingLeft={icon ? '3rem' : '1rem'}
                display='flex'
                alignItems='center'
                justifyContent='center'
            />
        </Box>
    )
}

export default PanelTextBox;