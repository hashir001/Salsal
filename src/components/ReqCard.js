import { Flex, Image, Stack, Text } from '@chakra-ui/react'
import { collection } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'

const ReqCard = ({collectionData}) => {
    //bg-pink-900
    const newTo = {
        pathname:"/reqverify/"+collectionData.id
    }

  return (
    <Flex overflow='hidden' w="100%" boxShadow={'2xl'} flexDir='column' mt={10} >
      <Stack overflow='hidden' direction='row' p="5" h='400px' w="900px" borderWidth="1px" boxShadow={'2xl'}>

      <Flex flexDir='column' >
      <Image overflow='hidden' src={collectionData.NFTImageURL} boxSize='300px' objectFit='cover'/>
      </Flex>

      <Flex overflow='hidden' maxW='70%' maxH='1500px' flexDir='column' ml={10}  >
        <Text isTruncated mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">{collectionData.Name}</Text>
        <Text noOfLines={5} fontSize="md" mt={2}>{collectionData.Description}</Text>

        <Text isTruncated mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">Collection Details</Text>
        <Text isTruncated mt={2} fontSize="md" lineHeight="short">{collectionData.CollectionDetailsIPFS}</Text>

        <Text isTruncated mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">Provenance File</Text>
        <Text isTruncated mt={2} fontSize="md" lineHeight="short">{collectionData.ProvenanceHistoryIPFS}</Text>
      </Flex>
      </Stack>
      </Flex>
    
  )
}

export default ReqCard