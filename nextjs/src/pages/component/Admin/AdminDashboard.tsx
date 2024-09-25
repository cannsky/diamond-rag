import React, { useState, useEffect, useRef } from 'react';
import formatText from '../utility';
import { Flex, Box, Grid, Text, Icon } from '@chakra-ui/react';
import { FaBook, FaReadme ,  FaChartLine } from 'react-icons/fa';
import PanelButton from './component/PanelButton';
import { useRouter } from 'next/router';

const AdminDashboard : React.FC = () => {
    
    const router = useRouter();

    const handleRouting = (route: string) => {
        router.push(route);
    }

    return(
        <Flex direction='column' h='100vh' w='100%' bg='gray.750' color='white'>
            <Flex direction='column' p={4} overflowY='auto' flexGrow={1}>
                <Flex justify='center'>
                    <Text fontSize='2xl' fontWeight='bold'>Admin Dashboard</Text>
                </Flex>

                <Grid templateColumns ='repeat(auto-fill, minmax(150px, 1fr))' gap={4} justifyContent='center'>
                    <PanelButton text='Context' icon={FaBook} color='orange' onClick={() => handleRouting('/admin/context')} />
                    <PanelButton text='Prompt' icon={FaReadme} color='orange' onClick={() => handleRouting('/admin/predefinedPrompt')} />
                    <PanelButton text='Statistics' icon={FaChartLine} color='green' onClick={() => handleRouting('/admin/context')} />
                </Grid>
            </Flex>
        </Flex>
    )
}

export default AdminDashboard;