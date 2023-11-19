import {createContext, useState, useRef, useEffect} from "react"
import { io } from "socket.io-client"

const SocketContext = createContext()
const socket = io("http://localhost:8000")

const ContextProvider = ({ children }) => {
  const [loggedInUser,setLoggedInUser] = useState(JSON.parse(localStorage.getItem("user:details")))
  const [activeUsers,setActiveUsers] = useState([])
  
  useEffect(()=>{
    socket.emit("addUser", loggedInUser.userId)
    socket.on("getUsers", users => {
      setActiveUsers(users)
    })
  },[])
  
  return <SocketContext.Provider value={{loggedInUser,activeUsers, socket}}>
    {children}
  </SocketContext.Provider>
}

export {ContextProvider, SocketContext}