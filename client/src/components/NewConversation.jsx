import "./NewConversation.css"
import {useState,useEffect,useContext} from "react"
import {SocketContext} from "../SocketContext"
import {useNavigate} from "react-router-dom"
import {IconAt,IconUserCircle,IconPlus} from "@tabler/icons-react"

const NewConversation = () => {
  const [query,setQuery] = useState("")
  const handleQuery = (e) => {
    setQuery(e.target.value)
  }
  const [users,setUsers] = useState([])
  useEffect(()=>{
    const fetchData = async () => {
      const userToken = localStorage.getItem("user:token")
      const res = await fetch(`/api/v1/users/${query.trim().toLowerCase()}`,{
        headers: {
          authorization: userToken
        }
      })
    if(res.status !== 200){
      console.log("Error")
    }else{
      res.json().then((data)=>{
        setUsers(data)
      })
    }
    }
    fetchData()
  },[query])
  return (
    <>
      <div className="new-convo-container">
        <h3 style={{margin:"15px 0"}}>start a conversation</h3>
        <div className="new-convo-input-wrapper">
          <IconAt className="at-icon"/>
          <input value={query} onChange={handleQuery} type="text" placeholder="username" />
        </div>
        <Users users={users}/>
      </div>
    </>
  )
}

const Users = ({users}) => {
  const {loggedInUser} = useContext(SocketContext)
  users = users.filter((user)=> user.id !== loggedInUser.userId)
  const navigate = useNavigate()
  const createConversation = async (user) => {
    navigate("/chat",{state:{chatter:{user:user}}})
  }
  return (
    <>
      <div className="new-convo-users-container">
      {users.length < 1 ? <h3>No Search results</h3> : 
      users.map((user)=>{
        return <div className="new-convo-user">
          <div className="user-image">
          { user.image === undefined ?
            <IconUserCircle />
            : <img src={user.image} alt={user.name}/>
          }
          </div>
          <div className="user-info">
            <h4>{user.verified !== undefined ? <img style={{width:"15px"}} src={"/icons/verified.svg"} />  : null}{user.name}</h4>
            <p>@{user.username}</p>
          </div>
          <div onClick={()=>createConversation(user)} className="user-add-icon">
            <IconPlus />
          </div>
        </div>
      })
      }
      </div>
    </>
  )
}

export default NewConversation