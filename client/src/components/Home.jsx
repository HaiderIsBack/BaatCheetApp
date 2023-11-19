import "./Home.css"
import {useNavigate} from "react-router-dom"
import {useState,useRef,useEffect,useCallback} from "react"
import {
  IconHome,
  IconSettings,
  IconSquareRoundedX,
  IconDotsVertical,
  IconUserCircle,
  IconUserEdit,
  IconShield,
  IconLogout,
  IconMessagePlus,
  IconSearch
} from "@tabler/icons-react"

const Home = () => {
  return (
      <>
        <HomeNav />
        <Chatters />
        <NewChat />
      </>
    )
}

const HomeNav = () => {
  const navigate = useNavigate()
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user:details")))
  const [menuOpened,setMenuOpened] = useState(false)
  const menuRef = useRef(null)
  const handleMenu = useCallback(() => {
    if(menuOpened){
      menuRef.current.style.right = "-100%"
    }else{
      menuRef.current.style.right = "0%"
    }
    setMenuOpened(!menuOpened)
  },[menuOpened])
  const handleLogout = () => {
    localStorage.removeItem("user:details")
    localStorage.removeItem("user:token")
    navigate("/login")
  }
  return (
      <>
      <div ref={menuRef} id="side-menu" className="side-menu">
        <div onClick={handleMenu} className="side-menu-close">
          <IconSquareRoundedX size={40} />
        </div>
        <div className="side-menu-user">
          {user.image === undefined ?
            <IconUserCircle size={100} />
            : <img src={user.image} />
          }
          <h3>{user.name}</h3>
          <p>@{user.username}</p>
        </div>
        <div onClick={()=>navigate("/profile")} className="side-menu-item">
          <IconUserEdit />
          <h3>Profile</h3>
        </div>
        <div className="side-menu-item">
          <IconSettings />
          <h3>Settings</h3>
        </div>
        <div className="side-menu-item">
          <IconShield />
          <h3>Security</h3>
        </div>
        <div onClick={handleLogout} style={{color:"crimson"}} className="side-menu-item">
          <IconLogout />
          <h3>Log out</h3>
        </div>
        <p style={{color:"goldenred",fontSize:"9px"}}>By Syed Zulqarnain Haider</p>
      </div>
        <div className="home-nav-container">
          <div className="home-nav-icon">
            <IconHome />
          </div>
          <div className="home-nav-title">
            <h2>BAAT CHEET APP</h2>
          </div>
          <div className="home-nav-search">
            <IconSearch />
          </div>
          <div onClick={handleMenu} className="home-nav-menu">
            <IconDotsVertical />
          </div>
        </div>
      </>
    )
}

const Chatters = () => {
  const [chatters,setChatters] = useState([])
  useEffect(()=>{
    const fetchChatters = async () => {
      const userId = JSON.parse(localStorage.getItem("user:details")).userId
      const res = await fetch(`/api/v1/conversation/${userId}`)
      res.json().then((data)=>{
        setChatters(data)
      })
    }
    fetchChatters()
  },[])
  return (
      <>
        <div className="chatters-container">
        { chatters.length > 0 ?
          chatters.map((chatter,i)=>{
            return <Chatter key={i} chatperson={chatter} />
          })
          : 
          <div className="no-conversation">
            <img src="/icons/empty-mailbox.svg" />
            <h4>No Conversations Here</h4>
          </div>
        }
        </div>
      </>
    )
}

const Chatter = ({chatperson, key}) => {
  const navigate = useNavigate()
  const openChat = () => {
    navigate("/chat",{state:{chatter:chatperson}})
  }
  return (
      <>
        <div onClick={openChat} className="chatter-container">
          <div className="chatter-img">
          {chatperson.user.img === undefined ? <IconUserCircle size={40}/>
          : <img src={chatperson.user.img} alt={chatperson.user.name} />}
          </div>
          <div className="chatter-info">
            <h6>{chatperson.user.verified === "true" ? <img src="/icons/verified.svg"/> : null}{chatperson.user.name}</h6>
            <p>@{chatperson.user.username}</p>
          </div>
          <div className="chatter-menu">
            <button>
              <IconDotsVertical />
            </button>
          </div>
        </div>
      </>
    )
}

const NewChat = () => {
  const navigate = useNavigate()
  return (
      <>
        <div className="new-chat-btn">
          <button onClick={()=> navigate("/newconversation")}>
            <IconMessagePlus />
          </button>
        </div>
      </>
    )
}

export default Home