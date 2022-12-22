return (
    <div style={{margin:10}}>
      <div 
        className="chat-box"
        style={{border:'1px solid black', width:'60%',padding:20,marginLeft:120}}>
            {docs?.map(doc => <div 
            style={{
            backgroundColor:'#ADD8E6',
            width:'60%',
            margin:10,
            border:'1px solid gray',
            borderRadius:999,
            overflow:'hidden',
            padding:9,
            paddingLeft:35}} 
            key={Math.random()}>
                <p style={{backgroundColor:'#ADD8E6'}}>From: {doc.from}</p>
                <p style={{backgroundColor:'#ADD8E6'}}>Message: {doc.message}</p>
                <p style={{backgroundColor:'#ADD8E6'}}>Time: {String(doc.time)}</p>
                </div>)}

        <input 
        value={message}
        onChange = {(e) => setMessage(e.target.value)}
        placeholder='Type message' 
        style={{border:'1px solid black',marginTop:20, width:350,borderRadius:999,overflow:'hidden',height:50,padding:20}}></input>  

        <button 
        style={{marginTop:20}}
        onClick={sendMessage}
        class="flex items-center justify-center
        py-1 px-3  font-small text-center text-black bg-rose-900 rounded-lg  
        focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
        dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Send Message
        </button>     
            
    </div>





    </div>


  )