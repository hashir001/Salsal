import React from 'react'
import '../style1.css';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom'
import { Heading } from '@chakra-ui/react';

const Home = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/marketplace');
} 

  return (
<div> 
      <div>
        <Heading>AGUR</Heading>
        <p style = {{fontSize:20}}>Store Ancient Artifacts On The Blockchain </p>
        <div><button onClick={handleClick}>View Collection</button></div>
      </div>
</div>
  )
}

export default Home