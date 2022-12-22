import React from "react";
import { Text, Highlight, Heading, Button, Divider, Flex, Container } from "@chakra-ui/react";
import { useNavigate } from 'react-router';
import { Timeline} from '@mantine/core';
import { Text as MantText} from '@mantine/core';
import { createStyles } from '@mantine/core';
import { IconGitBranch, IconGitPullRequest, IconGitCommit, IconMessageDots } from '@tabler/icons';
import { Center, Box, Image, Badge } from '@chakra-ui/react'
import { MdStar } from "react-icons/md";
import { useState } from "react";
import { AddIcon } from '@chakra-ui/icons'

const LandingPage = () => {
  const [ active, setActive ] = useState(3)
  const navigate = useNavigate()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry)
      if(entry.isIntersecting){
        entry.target.classList.add('show')
      }
    })
  })


  const handleClick = () => {
    navigate('/marketplace');
} 
    const useStyles = createStyles((theme, _params, getRef) => ({
      wrapper: {
        backgroundColor:theme.colors.dark[5],
        maxWidth: 400,
        width: '100%',
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    }))

    const { classes } = useStyles();
    
  return (
    <Flex flexDir='column'>
      <Flex h='75vh' align='center' flexDir='row'>
        <Heading
          mt="140"
          fontSize="270"
          ml="200"
          color="RGBA(0, 0, 0, 0.92)"
          align="center"
          letterSpacing="tighter"
          fontWeight="extrabold"
          lineHeight="tall"
        >
          AGUR <br /></Heading>
        <Image mb='100px' w = '930px' h='950px' pt='230' borderRadius='2% 98% 0% 100% / 0% 100% 0% 100%   'src="https://images.unsplash.com/photo-1644215529308-7877e68eb0b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80" />   
    </Flex>

    <Flex flexDir='row'  ml='320' mt='-150' mb='100px'>
    <Flex flexDir='column'>
    <Heading  
          fontSize="28px" 
          letterSpacing="tight"
          fontWeight="bold"
          lineHeight="tall" 
          align="center" 
          color='pink.900'
          mt="30px">
          Record your heritage object on the Blockchain
        </Heading>
        <Button
          _hover={{bg:'green.700'}}
          _focus={{bg:'green.700'}}
          bg="green.800"
          color='white'
          padding="2rem"
          height="2rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={3}
          align="center"
          mx="auto"
          onClick={handleClick}
        >
          View Collection
        </Button>
        </Flex>
        </Flex>

  <Flex bg={'black'} flexDir='column' align={'center'}>
  <Flex bg={'black'} flexDir='column' align={'center'} w='60%'>
    <Heading alignSelf='center' color='white' mt='30px' mb='30px' fontSize='60'>Our Purpose</Heading>
    <Text alignSelf='center' w='100%' color='gray' fontSize='30' ml='20' mt='10px'>To allow heritage collectors a platform to verify their collection.  
    <br/> Provide an accurate history of an object's ownership<br />  </Text>
    </Flex>

    <Flex bg={'black'} flexDir='column' align={'center'} w='60%' >
    <Heading alignSelf='center' color='white' mt='30px' mb='30px' fontSize='60'>How It Works</Heading>
    <Text alignSelf='center' w='100%' color='gray' fontSize='30' ml='20' mt='10px'>
    It begins with the Collector: he uploads a collection and submits it for verification.
    <br/>
    Then multiple Experts who specialise in the collection's field will evaluate the Collection and submit their
    evaluation to the Central Verficiation Board.
    <br/>
    It is the Board's duty to evaluate what the Experts say and pass the final judgement: if the Collection is legitimate.
    <br/>
    Once proven to be legitimate, the Collector can turn it into an NFT which is a Non Fungible Token. We use NFTs as their data is stored on the Blockchain and is immutable, allowing us
    to document the transfer of ownership accurately.
    </Text>
    </Flex>

    <Flex bg={'black'} flexDir='column' align={'center'} w='75%'>
    <Heading alignSelf='center' color='white' fontSize='60' mt='30px' mb='30px'>Blockchain and NFTs</Heading>
    <Text alignSelf='center'w='80%' color='gray' fontSize='30'ml='20' mt='10px' lineHeight='50px'>We store all collection data, expert votes and verification on the Blockchain. 
    <br/>
    Since the Blockchain is immutable, it provides us with a factual history of an object's owners. 
    <br />
    We use NFTs for ownership transfer. NFT data is stored on the Blockchain so we end up with an immutable,
    permanent record of ownership transfer.
    </Text>
    </Flex>


    <Timeline className ='timeline' color="teal" sx={{backgroundColor:'black',marginLeft:'20%',marginTop:100}} active={active} bulletSize={70} lineWidth={6}>
      <Timeline.Item className ='timelineElement' bullet={<IconGitBranch size={50} />} sx={{color:'white',fontSize:100,marginTop:30,paddingTop:60}} title='Collector'>
        <MantText sx={{backgroundColor:'black',fontSize:30,marginLeft:30,marginTop:30}} color="dimmed" size="sm">Uploads collection data. If verified, the collector can turn it into an NFT    </MantText> 
      </Timeline.Item>

      <Timeline.Item className ='timelineElement' bullet={<IconGitCommit size={50} />} sx={{color:'white',fontSize:100,marginTop:30,paddingTop:60}} title='Expert'>
        <MantText sx={{backgroundColor:'black',fontSize:30,marginLeft:30,marginTop:30}} color="dimmed" size="sm">Votes on collection: if they believe the collection is legitimate   </MantText> 
      </Timeline.Item>

      <Timeline.Item className ='timelineElement' bullet={< IconGitPullRequest size={50} />} sx={{color:'white',fontSize:100,marginTop:30,paddingTop:60}} title='Board'>
        <MantText sx={{backgroundColor:'black',fontSize:30,marginLeft:30,marginTop:30}} color="dimmed" size="sm">Evaluates all expert votes and passes the final judgment about the collection. <br/>If successfully verified, the collector can turn it into an NFT and transfer ownership through the system  </MantText> 
      </Timeline.Item>

      <Timeline.Item bullet={<IconGitBranch size={50} />} sx={{backgroundColor:'black',marginBottom:'100px'}}>
      <MantText sx={{backgroundColor:'black'}} backgroundColor="red" size="lg"> </MantText>
      </Timeline.Item>
    </Timeline> 
    </Flex>
   </Flex>
  )
}
     
export default LandingPage