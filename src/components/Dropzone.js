import React, { useCallback } from 'react'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { db,storage } from '../firebase'


const Dropzone = () => {
    const [ selectedImages, setSelectedImages ] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        setSelectedImages(acceptedFiles.map(file => 
            Object.assign(file,{
                preview:URL.createObjectURL(file)
            })))
      }, [])
      const {getRootProps, getInputProps} = useDropzone({onDrop})
      const selected_images = selectedImages?.map(file=>(
        <div></div>
      ))
      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      )
}

export default Dropzone