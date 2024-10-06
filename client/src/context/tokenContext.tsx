import React, {createContext} from 'react'

interface tokenInterface {
    getToken: ()=>string|null;
    setToken: (token:string)=>void;
    removeToken: () => void
}
interface ContextProviderProps {
    children: React.ReactNode;
  }

const setToken = (newToken:string)=>{
      localStorage.setItem("token",newToken);
  }
const getToken = ()=>{
    return localStorage.getItem("token");
}
const removeToken = ()=>{
    localStorage.removeItem("token");
}



export const TokenContext = createContext<tokenInterface>({getToken,setToken,removeToken});

export const ContextProvider:React.FC<ContextProviderProps> = ({children})=>{

    
    return (
        <TokenContext.Provider value={{getToken,setToken,removeToken}}>
          {children}
        </TokenContext.Provider>
    )
}

