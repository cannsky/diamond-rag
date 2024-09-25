import React, { useState, useEffect, useRef } from 'react';
import { Flex, Box, Grid, Text, Icon } from '@chakra-ui/react';
import NewContext from './component/NewContext';
import EditContext from './component/EditContext';
import PanelButton from '../component/PanelButton';
import { FaBook, FaReadme } from 'react-icons/fa';

const ContextPanel : React.FC = () => {

    enum Selection { null, new, edit }

    const [selection, setSelection] = useState<Selection>(Selection.null);

    return(
        <Flex direction='column' h='100vh' w='100%' bg='gray.750' color='white'>
            <Flex direction='column' p={4} overflowY='auto' flexGrow={1}>
                <Flex justify='center'>
                    <Text fontSize='2xl' fontWeight='bold'>Admin Dashboard</Text>
                </Flex>

                { selection === Selection.null ? (
                    <Grid templateColumns ='repeat(auto-fill, minmax(150px, 1fr))' gap={4} justifyContent='center'>
                        <PanelButton text='New' icon={FaBook} color='orange' onClick={() => setSelection(Selection.new)} />
                        <PanelButton text='Edit' icon={FaReadme} color='orange' onClick={() => setSelection(Selection.edit)} />
                    </Grid>
                ) : selection === Selection.new ? (
                    <NewContext />
                ) : (
                    <EditContext />
                )}
            </Flex>
        </Flex>
    )
}

export default ContextPanel;