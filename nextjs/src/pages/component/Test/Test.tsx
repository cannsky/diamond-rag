import React, { useState, useEffect, useRef } from 'react';
import formatText from '../utility';
import { Flex, Box, Grid, Text, Icon } from '@chakra-ui/react';
import { FaBook, FaReadme ,  FaChartLine } from 'react-icons/fa';
import TestButton from './component/TestButton';
import { useRouter } from 'next/router';
import { UserSession } from '../../utility/interface/userSession';
import { tts, sr } from '../../utility/speech';

const Test : React.FC = () => {
    
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
                    <TestButton text='TTS' icon={FaBook} color='orange' onClick={() => tts('Hi how are you?')} />
                    <TestButton text='SR' icon={FaBook} color='orange' onClick={() => sr()} />
                </Grid>
            </Flex>
        </Flex>
    )
}

export default Test;