import { Navigate, Outlet } from 'react-router-dom'
import { LoginContext } from './LoginContext'
import { useEffect, useState, useContext } from 'react';

const CollectorRoute = () => {
  const { data, setData } = useContext(LoginContext);

//   let accountType = JSON.parse(localStorage.getItem('accountType'));
//   let address = JSON.parse(localStorage.getItem('address'));
//  console.log('in route: ' + accountType + ' address: ' + address)

return (
    ((data.accountType == 'collector'| data.accountType == 'admin') && data.address != '0x') ? <Outlet/> : <Navigate to='/'/>
    //((accountType == 'collector'| accountType == 'admin') && address != '0x') ? <Outlet/> : <Navigate to='/'/>
  )
}

export default CollectorRoute