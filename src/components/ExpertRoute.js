import { Navigate, Outlet } from 'react-router-dom'
import { LoginContext } from './LoginContext'
import { useEffect, useState, useContext } from 'react';

const ExpertRoute = () => {
  const { data, setData } = useContext(LoginContext);

return (
    ((data.accountType == 'expert'| data.accountType == 'admin') && data.address != '0x') ? <Outlet/> : <Navigate to='/'/>
  )
}

export default ExpertRoute