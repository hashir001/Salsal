import { Navigate, Outlet } from 'react-router-dom'
import { LoginContext } from './LoginContext'
import { useEffect, useState, useContext } from 'react';

const CollectorRoute = () => {
  const { data, setData } = useContext(LoginContext);


return (
    ((data.accountType == 'collector'| data.accountType == 'admin') && data.address != '0x') ? <Outlet/> : <Navigate to='/'/>
  )
}

export default CollectorRoute