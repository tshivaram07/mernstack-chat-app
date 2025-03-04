import { createContext, useContext, useEffect, useState } from "react";
const ChatContext=createContext()
import { useNavigate } from "react-router-dom";
const ChatProvider=({children})=>{
    const [user, setuser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const navigate=useNavigate();
    const [notification, setnotification] = useState([])
    useEffect(() => {
      const userInfo=JSON.parse(localStorage.getItem("userInfo"))
      setuser(userInfo)
      if(userInfo){
       navigate("/chats")
      }
    }, [navigate])
    
    return(
        <ChatContext.Provider value={{user,setuser, selectedChat,setSelectedChat, chats, setChats, notification, setnotification}}>
         {children}
        </ChatContext.Provider>
    )
}
export const ChatState=()=>useContext(ChatContext)
export default ChatProvider;