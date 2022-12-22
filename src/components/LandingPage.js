import React from "react";
import "../style1.css";
import { Text, Highlight, Heading, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router';
import { Timeline} from '@mantine/core';
import { Text as MantText} from '@mantine/core';
import { createStyles } from '@mantine/core';
import { IconGitBranch, IconGitPullRequest, IconGitCommit, IconMessageDots } from '@tabler/icons';

const LandingPage = () => {
  const navigate = useNavigate()

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
    <div style={{overflow:'auto'}} >
      <div style={{overflow:'auto',height:'75vh'}} className='h-screen flex flex-col  '>
        <Heading
          mt="140"
          fontSize="110"
          mx="20"
          color="RGBA(0, 0, 0, 0.92)"
          align="center"
          letterSpacing="tighter"
          fontWeight="extrabold"
          lineHeight="tall"
        >
          MUSK <br /></Heading>
          <Heading
           fontSize="50"
           mx="20"
           color="RGBA(0, 0, 0, 0.92)"
           align="center"
           letterSpacing="tighter"
           fontWeight="extrabold"
           lineHeight="tall">
          <Highlight
            query="Blockchain"
            styles={{ px: "2.5", py: "2.5", rounded: "full", bg: "red.300" }}
          >
             Record Your Heritage Object on the Blockchain
          </Highlight>{" "}
        </Heading>

        <Heading  fontSize="22px" fontWeight="normal" align="center" mt="30px">
          Submit your collection for verification and record it on the Ethereum
          Blockchain.
        </Heading>

        <Button
          colorScheme="blue"
          padding="2rem"
          height="4rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={12}
          align="center"
          mx="auto"
          onClick={handleClick}
        >
          View Collection
        </Button>
      </div>


       {/* <div style={{backgroundColor:'black',display:'flex',width:'100%',height:'60vh'}}> */}


    {/* <Timeline sx={{backgroundColor:'black',marginLeft:'25%',marginTop:40,fontSize:100}} active={1} 
    bulletSize={40} lineWidth={6}>

      <Timeline.Item bullet={<IconGitBranch size={12} />} sx={{backgroundColor:'black'}}>
      <MantText sx={{backgroundColor:'black',fontSize:120}} color="white" size="xl">New Branch </MantText>
        <MantText sx={{backgroundColor:'black'}} color="dimmed" size="sm">You&apos;ve created new branch 
        <MantText sx={{backgroundColor:'black'}} variant="link" component="span" inherit>fix-notifications</MantText> from master</MantText>
      </Timeline.Item>

      <Timeline.Item bullet={<IconGitPullRequest size={12} />} sx={{backgroundColor:'black'}}>
      <MantText sx={{backgroundColor:'black'}} color="white" size="lg">New Branch </MantText>
        <MantText sx={{backgroundColor:'black'}} color="dimmed" size="sm">You&apos;ve created new branch 
        <MantText sx={{backgroundColor:'black'}} variant="link" component="span" inherit>fix-notifications</MantText> from master</MantText>
      </Timeline.Item>

      <Timeline.Item bullet={<IconGitCommit size={12} />} sx={{backgroundColor:'black'}}>
      <MantText sx={{backgroundColor:'black'}} color="white" size="lg">New Branch </MantText>
        <MantText sx={{backgroundColor:'black'}} color="dimmed" size="sm">You&apos;ve created new branch 
        <MantText sx={{backgroundColor:'black'}} variant="link" component="span" inherit>fix-notifications</MantText> from master</MantText>
      </Timeline.Item>

      <Timeline.Item bullet={<IconMessageDots size={12} />} sx={{backgroundColor:'black'}}>
      <MantText sx={{backgroundColor:'black'}} color="white" size="lg">New Branch </MantText>
        <MantText sx={{backgroundColor:'black'}} color="dimmed" size="sm">You&apos;ve created new branch 
        <MantText sx={{backgroundColor:'black'}} variant="link" component="span" inherit>fix-notifications</MantText> from master</MantText>
      </Timeline.Item>
    </Timeline> */}
    {/* </div> */}
    </div>
  );
};

export default LandingPage;

 {/* <div style={{position:'relative',flex:1}}>
    <div style={{position:'absolute',left:100}}>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-currency-ethereum"
     width="344" height="344" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 12l6 -9l6 9l-6 9z" />
      <path d="M6 12l6 -3l6 3l-6 2z" />
    </svg>
    </div>
  </div> */}
