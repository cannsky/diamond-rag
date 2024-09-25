import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { formatText, extractTagContent } from './utility';
import { Flex, Box, Textarea, Image, HStack, Text, IconButton } from '@chakra-ui/react';
import { FaMicrophone } from 'react-icons/fa';
import { sr } from '../utility/speech';
import { useRouter } from 'next/router';

const ChatContainer : React.FC = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<{input: string, response: string, pending: boolean}[]>([]);
    const [incomingMessage, setIncomingMessage] = useState<string>("");
    const [incomingMessages, setIncomingMessages] = useState<string[]>([]);
    const [isStreamDataEnded, setIsStreamDataEnded] = useState<boolean>(false);
    const [isRequestingResponse, setIsRequestingResponse] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if(textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
            if (scrollHeight === 54 && !text.includes('\n')) textAreaRef.current.style.height = '34px';
            else textAreaRef.current.style.height = scrollHeight + 'px';
        }
    }, [text]);

    useEffect(() => {
        if (chatId && chatId !== router.query.chatId) {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, chatId },
          }, undefined, {shallow: true});
        }
    }, [chatId]);

    useEffect(() => {
        if (router.query.chatId) {
            if (text === '' && messages.length === 0 && !isRequestingResponse) sendGetMessagesRequest();
            else setChatId(router.query.chatId as string);
        }
    }, [router.query.chatId]);

    useEffect(() => {
        socket?.on("stream", (data) => {
            if (data.data != "END_OF_STREAM_DATA") {
                const chatId = extractTagContent(data.data, "CHAT_ID");
                if (chatId) setChatId(chatId);
                else setIncomingMessages((prevMessages) => [...prevMessages, data.data]);
            }
            else {
                setIsStreamDataEnded(true);
                socket.disconnect();
            }
        });

        socket?.on("error", (error) => {
            console.error(error.data);
        });

        return () => {
            socket?.off("stream");
            socket?.off("error");
        };
    }, [socket]);

    useEffect(() => {
        if (isStreamDataEnded) {
            const newMessage = incomingMessages.join("");
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const pendingIndex = updatedMessages.findIndex((msg) => msg.pending);
                if (pendingIndex !== -1) {
                    updatedMessages[pendingIndex] = {
                        ...updatedMessages[pendingIndex],
                        response: newMessage,
                        pending: false
                    }
                }
                return updatedMessages;
            });
            setIncomingMessages([]);
            setIsStreamDataEnded(false);
        }
    }, [isStreamDataEnded]);

    useEffect(() => {
        if (incomingMessages.length > 0) setIncomingMessage(incomingMessages.join(""));
        else setIncomingMessage("");
    }, [incomingMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, incomingMessage]);

    useEffect(() => {
        if (!isRequestingResponse) return;
        sendSendMessageRequest(messages[messages.length - 1].input);
    }, [isRequestingResponse]);

    const sendSendMessageRequest = async (message: string) => {
        try {
            const newSocket = io();
            setSocket(newSocket);

            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ chatId: chatId, message: message })
            });

            if (response.ok) setIsRequestingResponse(false);
        }
        catch (error) {
            console.error ("Error: ", error);
        }
    }

    const sendGetMessagesRequest = async () => {
        try {
            const response = await fetch("/api/data/user/chat/get/" + router.query.chatId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const messages = await response.json();
                console.log(messages);
                if (messages) {
                    setMessages(messages);
                }
            }

            if (!response.ok) console.error("Failed to send message!");
        }
        catch (error) {
            console.error ("Error: ", error);
        }
    }

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isRequestingResponse) return;
        else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setMessages((prevMessages) => [...prevMessages, {input: text, response: '', pending: true}]);
            setIsRequestingResponse(true);
            setText("");
        }
    };

    return(
        <Flex direction='column' h='100vh' w='100%' bg='gray.750' color='white'>
            <Flex direction='column' p={4} overflowY='auto' flexGrow={1}>
                <Flex justify='center'>
                    {messages.length != 0 ? (
                        <Box w='70%'>
                            {messages.map((msg, index) => (
                                <React.Fragment key={index}>
                                    <Flex justifyContent='flex-end'>
                                        <HStack align='flex-start' p={2} mb={2} spacing={4} bg='gray.720' w='50%'>
                                            <Box fontSize='md'>
                                                {formatText(msg.input)}
                                            </Box>
                                        </HStack>
                                    </Flex>
                                {msg.response && (
                                    <Flex justifyContent='flex-start'>
                                        <HStack align='flex-start' p={2} mb={2} spacing={4}>
                                            <Image src='./aiAvatar.png' boxSize='30px' borderRadius='full' alt='AI Avatar' />
                                            <Box fontSize='md'>
                                                {formatText(msg.response)}
                                            </Box>
                                        </HStack>
                                    </Flex>
                                )}
                                </React.Fragment>
                            ))}
                            {incomingMessage && (
                                <Flex justifyContent='flex-start'>
                                    <HStack align='flex-start' p={2} mb={2} spacing={4}>
                                        <Image src='./aiAvatar.png' boxSize='30px' borderRadius='full' alt='AI Avatar' />
                                        <Box fontSize='md'>
                                            {formatText(incomingMessage)}
                                        </Box>
                                    </HStack>
                                </Flex>
                            )}
                            <div ref={messagesEndRef} />
                        </Box>
                    ) : (
                        <Flex position='absolute' direction='column' height='50vh' justifyContent='flex-end'>
                            <Flex direction='column' align='center'>
                                <Image src='./aiAvatar.png' boxSize='100px' borderRadius='full' alt='AI Avatar' />
                                <Box fontSize='md' color='white'>
                                    <Text fontSize='2xl' as='span' color='teal.300'>
                                        Diamond AI
                                    </Text>
                                    &nbsp;v0.0.2
                                </Box>
                                <Box fontSize='md' color='white'>
                                    <Text fontSize='2xl' as='span' color='teal.300'>
                                        
                                    </Text>
                                    &nbsp;How may I help you today?
                                </Box>
                            </Flex>
                        </Flex>
                    )}
                </Flex>
            </Flex>
            <Flex justify='center' align='flex-end' position='relative' p={4}>
                <Textarea
                    value={text}
                    w='70%'
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                    ref={textAreaRef}
                    _placeholder={{ color: 'gray.400' }} 
                />
                    <IconButton
                        aria-label='Microphone'
                        icon={<FaMicrophone />}
                        size='md'
                        ml={2}
                        bg='transparent'
                        color='white'
                        _hover={{ bg: 'orange' }}
                    >
                    </IconButton>
            </Flex>
        </Flex>
    )
}

export default ChatContainer;