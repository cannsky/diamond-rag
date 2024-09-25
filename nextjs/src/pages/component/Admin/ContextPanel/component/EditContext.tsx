import React, { useState, useEffect, useRef } from 'react';
import { Flex, Box, Grid, Text, Icon } from '@chakra-ui/react';
import { FaBook, FaChartLine } from 'react-icons/fa';
import PanelTextBox from '../../component/PanelTextBox';
import PanelSubmit from '../../component/PanelSubmit';

const NewContext : React.FC = () => {
    const [contextName, setContextName] = useState('');
    const [predefinedPromptName, setPredefinedPromptName] = useState('');
    const [sortOrder, setSortOrder] = useState(0);

    const handlePostRequest = async () => {
        const data = { contextName, predefinedPromptName, sortOrder };
        try {
            const response = await fetch('/api/data/admin/context/addContextPredefinedPrompt', {
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
                    <Text fontSize='2xl' fontWeight='bold'>Edit existing context</Text>
                </Flex>

                <Flex direction='column' align='center' gap={4}>
                    <PanelTextBox placeholder='Enter name' icon={FaBook} onChange={setContextName} />
                    <PanelTextBox placeholder='Enter name' icon={FaBook} onChange={setPredefinedPromptName} />
                    <PanelTextBox placeholder='Enter number' icon={FaChartLine} onChange={(value) => setSortOrder(Number(value))} />
                    <PanelSubmit text='Submit' onClick={handlePostRequest} />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default NewContext;