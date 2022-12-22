import { Badge, Flex, Image, Stack, Text } from '@chakra-ui/react'
import { collection } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'

const VerifyCard = ({collectionData}) => {
    const newTo = {
        pathname:"/createnft/"+collectionData.id
    }
return(
  <Link to={newTo}>
      <Flex overflow='hidden' w="100%" boxShadow={'2xl'} flexDir='column' mt={10} >
      <Stack overflow='hidden' direction='row' p="5" h='400px' w="900px" borderWidth="1px" boxShadow={'2xl'}>

      <Flex flexDir='column' >
      <Link to={newTo}><Image overflow='hidden' src={collectionData.NFTImageURL} boxSize='300px' objectFit='cover'/></Link>
      </Flex>

      <Flex overflow='hidden' maxW='70%' maxH='200px' flexDir='column' ml={10}  >
        <Flex align="baseline" mt={2}><Badge colorScheme="green">Verified</Badge></Flex>
        <Text isTruncated mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">{collectionData.Name}</Text>
        <Text noOfLines={5} fontSize="md" mt={2}>{collectionData.Description}</Text>
      </Flex>
      </Stack>
      </Flex></Link>
)
  // return (
  //   <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
  //   <Link to = {newTo}>
  //       <img class="rounded-t-lg" src={collectionData.NFTImageURL} alt="" />
  //   </Link>
  //   <div class="p-5">
  //       <h5 class="mb-2 text-2xl font-bold tracking-tight text-black dark:text-white">
  //       {collectionData.Name}</h5>
        
  //       <p class="mb-3 font-normal text-black dark:text-gray-400">
  //       {collectionData.Description}
  //       </p>
        
  //       <Link to={newTo} class="inline-flex items-center 
  //     py-2 px-3 text-lg font-medium text-center text-white bg-rose-900 rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
  //            Create NFT
  //     </Link>
  //   </div>
  //   </div>
  // )
}

export default VerifyCard