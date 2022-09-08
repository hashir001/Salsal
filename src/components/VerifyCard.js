import { collection } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'

const VerifyCard = ({collectionData}) => {
    const newTo = {
        pathname:"/reqverify/"+collectionData.id
    }

  return (
<div class="flex justify-around mt-20 mb-20">
  <div class="rounded-lg shadow-lg bg-white max-w-xs">
  <Link to = {newTo}>
      <img class="rounded-t-lg" src={collectionData.NFTImageURL} alt=""/>
      </Link>
    <div class="p-6">
      <h5 class="text-white text-2xl font-medium mb-2">{collectionData.Name}</h5>
      <p class="text-white text-base mb-4">
      {collectionData.Description}
      </p>

      <Link to={newTo} class="inline-flex items-center 
      py-2 px-3 text-lg font-medium text-center text-white bg-rose-900 rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Verify
      </Link>
     
    </div>
  </div>
//</div>




  //   <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
  //  {/* // <Link to = {newTo}> */}
  //       <img class="rounded-t-lg overflow-hidden" src={collectionData.NFTImageURL} alt="" />
  //   {/* </Link> */}
  //   <div class="p-5">
  //       <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
  //       {collectionData.Name}</h5>
        
  //       <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
  //       {collectionData.Description}
  //       </p>
        
  //       <Link to={newTo} class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
  //           Verify
  //           <svg aria-hidden="true" class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
  //       </Link>
  //   </div>
  //   </div>
    // <div>
    //     <br />
    //     <Link to={newTo}>
    //     <h3>ID: {collectionData.id}</h3>
    //     <h3>Verified: {collectionData.Verified}</h3>
    //    <h1>Name: {collectionData.Name}</h1>
    //     <p>Price: {collectionData.Price}</p>
    //     <p>Description: {collectionData.Description}</p>
    //     <img style = {{width:200}}src={collectionData.NFTImageURL}></img>
    //     </Link>
    //     <br />
    // </div>
  )
}

export default VerifyCard