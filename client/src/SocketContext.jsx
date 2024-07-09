import {createContext, useState, useRef, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import { io } from "socket.io-client"

const SocketContext = createContext()
const socket = io("https://baat-cheet-app-backend.vercel.app")

const ContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const [loggedInUser,setLoggedInUser] = useState(JSON.parse(localStorage.getItem("user:details")))
  const [activeUsers,setActiveUsers] = useState([])
  
  const logOut = () => {
    localStorage.removeItem("user:details")
    localStorage.removeItem("user:token")
    navigate("/login")
  }
  
  useEffect(()=>{
    socket.emit("addUser", loggedInUser.userId)
    socket.on("getUsers", users => {
      setActiveUsers(users)
    })
  },[socket])
  
  return <SocketContext.Provider value={{loggedInUser,activeUsers, socket, logOut}}>
    {children}
  </SocketContext.Provider>
}

export {ContextProvider, SocketContext}
