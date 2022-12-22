import React from 'react'
import { useLocation, useParams, Link } from 'react-router-dom';
import {  useState, useContext,useRef } from 'react';
import { storage, db, } from '../firebase'
import { Heading, IconButton, Text } from '@chakra-ui/react'
import { collection, addDoc, serverTimestamp} from 'firebase/firestore';
 import { query, orderBy, limit } from "firebase/firestore"; 
import { LoginContext } from './LoginContext'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import 'firebase/compat/firestore';
import { Flex, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import {IoMdSend} from 'react-icons/io'

const BoardChat = () => {
    const dummy = useRef();
    const [ message, setMessage ] = useState('')
    const [ docID, setDocID ] = useState('')
    
    let { id } = useParams();
    const { data, setData } = useContext(LoginContext);
    
    const collectionRef = collection(db, "Collection",id,"boardChatRoom");
    const q = query(collectionRef, orderBy("createdAt"), limit(30));
    const [messages] = useCollectionData(q, {idField: 'id'});
    
    
    
    const sendMessage = async(e) => {
        e.preventDefault();
    
        const docRef = await addDoc(collection(db, "Collection",id,'boardChatRoom'),{
           message:message,
           from: data.email,
           createdAt: serverTimestamp(),
           expertUID: data.uid,
           time: new Date().toLocaleString()
        })
      
        setDocID(docRef.id);
        setMessage('')
    }
    
      return(
        <Flex flexDir={'column'} align='center' >
            <Heading mt='100px'>Discuss With Board Members</Heading>
        <Flex flexDir='column'  mt='20px'  borderWidth='5px'  w='50%'>
          <Flex flexDir='column'  >
            <Flex flexDir='column'>
            {messages && messages.map(msg =>    
              <Flex flexDir={'row'} justify={msg.from === data.email? 'start':'end'}>
                  <Flex flexDir={'column'}borderWidth={'2px'} borderRadius='2xl'  mx='10px' my='10px' px={'9px'}><Text ><strong pl='15px'>Message:</strong>{msg.message}</Text>
                  <Text><strong>From:</strong>{msg.from}</Text>
                  <Text><strong>Time:</strong>{msg.time}</Text>
              </Flex>
              </Flex> 
            )}
            </Flex>
            <InputGroup>
              <InputRightElement
                pointerEvents='cursor'
                mt='10px'
                children={<IconButton bg="white" _hover={{bg:'white'}} onClick={sendMessage} size='sm' mx='20px' icon={<IoMdSend/>} />}
              />
              <Input  mt='10px' value={message} onChange = {(e) => setMessage(e.target.value)} type='text' placeholder='Enter Message' />
            </InputGroup>
          </Flex>
        </Flex>
        </Flex>
      )
    }


export default BoardChat