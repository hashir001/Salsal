import { collection } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Center, Image, Flex, Badge, Text, Stack, AspectRatio, Button } from "@chakra-ui/react";
import { MdStar } from "react-icons/md";

const VerifyCard = ({collectionData,link}) => {
    const newTo = {
      pathname:link+collectionData.id
    }

    return (
      <Link to={newTo}>
      <Flex overflow='hidden' w="100%" boxShadow={'2xl'} flexDir='column' mt={10} >
      <Stack overflow='hidden' direction='row' p="5" h='400px' w="900px" borderWidth="1px" boxShadow={'2xl'}>

      <Flex flexDir='column' >
      <Link to={newTo}><Image overflow='hidden' src={collectionData.NFTImageURL} boxSize='300px' objectFit='cover'/></Link>
      </Flex>

      <Flex overflow='hidden' maxW='70%' maxH='200px' flexDir='column' ml={10}  >
        <Flex align="baseline" mt={2}><Badge colorScheme="pink">Unverified</Badge></Flex>
        <Text isTruncated mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">{collectionData.Name}</Text>
        <Text noOfLines={5} fontSize="md" mt={2}>{collectionData.Description}</Text>
      </Flex>
      </Stack>
      </Flex></Link>
    )
}

export default VerifyCard