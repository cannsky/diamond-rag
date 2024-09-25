import React, { useState, useEffect, useRef } from 'react';
import formatText from '../utility';
import { Flex, Box, Grid, Text, Icon } from '@chakra-ui/react';
import { FaBook, FaChartLine } from 'react-icons/fa';
import PanelTextBox from './component/PanelTextBox';
import PanelSubmit from './component/PanelSubmit';

const ContextPanel : React.FC = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');

    const handlePostRequest = async () => {
        const data = { name, type, prefix, suffix };
        try {
            const response = await fetch('/api/data/admin/predefinedPrompt/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // success
            } 
            else {
                console.error('Failed to submit data');
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return(
        <Flex direction='column' h='100vh' w='100%' bg='gray.750' color='white'>
            <Flex direction='column' p={4} overflowY='auto' flexGrow={1}>
                <Flex justify='center'>
                    <Text fontSize='2xl' fontWeight='bold'>Predefined Prompt Panel</Text>
                </Flex>

                <Flex direction='column' align='center' gap={4}>
                    <PanelTextBox placeholder='Enter name' icon={FaBook} onChange={setName} />
                    <PanelTextBox placeholder='Enter type' icon={FaBook} onChange={setType} />
                    <PanelTextBox placeholder='Enter prefix' icon={FaBook} onChange={setPrefix} />
                    <PanelTextBox placeholder='Enter suffix' icon={FaBook} onChange={setSuffix} />
                    <PanelSubmit text='Submit' onClick={handlePostRequest} />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default ContextPanel;