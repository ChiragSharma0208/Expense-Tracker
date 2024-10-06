
import { TokenContext } from '@/context/tokenContext'
import { useContext, useEffect } from 'react'
import {  Outlet, useNavigate } from 'react-router-dom'

const Auth = () => {
    const {getToken} = useContext(TokenContext);
    const navigate = useNavigate();
    useEffect(()=>{
        const token = getToken();
        if(token){
            navigate("/dashboard")
        }
    },[getToken, navigate])
  return (
    <Outlet/>
  )
}

export default Auth
