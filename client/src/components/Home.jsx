import "./Home.css"
import {useNavigate} from "react-router-dom"
import {useState,useRef,useEffect,useCallback, useContext} from "react"
import {SocketContext} from "../SocketContext"
import MoonLoader from "react-spinners/MoonLoader";
import {
  IconHome,
  IconSettings,
  IconX,
  IconSquareRoundedX,
  IconDotsVertical,
  IconUserCircle,
  IconUserEdit,
  IconShield,
  IconLogout,
  IconMessagePlus,
  IconSearch,
  IconAlertTriangleFilled,
  IconTrash
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
  const {logOut} = useContext(SocketContext)
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user:details")))
  const [menuOpened,setMenuOpened] = useState(false)
  const [searchQuery,setSearchQuery] = useState()
  const menuRef = useRef(null);
  const searchBoxRef = useRef(null)
  
  const toggleSearchBox = useCallback(()=>{
    searchBoxRef.current.classList.toggle("show-searchbox")
  },[]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    
  }
  
  const handleMenu = useCallback(() => {
    if(menuOpened){
      menuRef.current.display= "none"
      menuRef.current.style.right = "-100%"
    }else{
      menuRef.current.display = "flex"
      menuRef.current.style.right = "0%"
    }
    setMenuOpened(!menuOpened)
  },[menuOpened])
  
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
          <h3>{user.verified === "true" ? <img src="/icons/verified.svg" style={{width:"20px",height:"20px",margin:"0 5px"}}/> : null}{user.name}</h3>
          <p>@{user.username}</p>
        </div>
        <div role="button" onClick={()=>navigate("/profile")} className="side-menu-item">
          <IconUserEdit />
          <h3>Profile</h3>
        </div>
        <div role="button" className="side-menu-item">
          <IconSettings />
          <h3>Settings</h3>
        </div>
        <div role="button" className="side-menu-item">
          <IconShield />
          <h3>Security</h3>
        </div>
        <div role="button" onClick={logOut} style={{color:"crimson"}} className="side-menu-item">
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
          <div onClick={toggleSearchBox} className="home-nav-search">
            <IconSearch />
          </div>
          <div onClick={handleMenu} className="home-nav-menu">
            <IconDotsVertical />
          </div>
        </div>
        <div className="home-nav-searchbox" ref={searchBoxRef}>
          <input onChange={handleSearch} value={searchQuery} type="text" placeholder="Search Here"/>
        </div>
      </>
    )
}

const Chatters = () => {
  const [loading,setLoading] = useState(false)
  const {logOut} = useContext(SocketContext)
  const [chatters,setChatters] = useState([])
  useEffect(()=>{
    const userToken = localStorage.getItem("user:token")
    setLoading(true)
    const fetchChatters = async () => {
      const userId = JSON.parse(localStorage.getItem("user:details")).userId
      fetch(`/api/v1/conversation/${userId}`,{
        headers: {
          "authorization": userToken
        }
      }).then((res)=>{
        setLoading(false)
        if(res.status === 440){
          logOut()
        }else if(res.ok){
          return res.json()
        }
      }).then((data)=>{
        setChatters(data)
      })
    }
    fetchChatters()
  },[])
  return (
      <>
        <div className="chatters-container">
        {loading ? <div className="myLoading">
        <MoonLoader
        color={"#f85032"}
        loading={loading}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
        </div> : null }
        { chatters.length > 0 ?
          chatters.map((chatter,i)=>{
            return <Chatter key={chatter.user.id} chatperson={chatter} />
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
  const [showOpt,setShowOpt] = useState(false)
  const imgBoxRef = useRef(null)
  const navigate = useNavigate()
  const openChat = () => {
    navigate("/chat",{state:{chatter:chatperson}})
  }
  const showOptions = () => {
    setShowOpt(prev => !prev)
  }
  const showImage = (e) => {
    imgBoxRef.current.classList.add("show-img");
  }
  const deleteConversation = () => {
    const userToken = localStorage.getItem("user:token")
    fetch(`/api/v1/conversation/${chatperson.conversationId}`,{
      headers: {
        authorization: userToken
      }
    })
    .then((res)=>{
      if(!res.ok){
        
      }else{
        return res.json()
      }
    })
    .then((data)=>{
      console.log(data)
    })
  }
  useEffect(()=>{
    window.addEventListener("click",(e)=>{
      if(e.target.id !== chatperson.user.id){
        setShowOpt(false)
      }
      if(e.target.id !== chatperson.user.username){
        imgBoxRef.current.classList.remove("show-img");
      }
    });
  },[])
  return (
      <>
        <div className="chatter-container">
          <div className="chatter-img">
          {chatperson.user.image === undefined ? <IconUserCircle size={40}/>
          : <img id={chatperson.user.username} ref={imgBoxRef} onClick={showImage} src={chatperson.user.image} alt={chatperson.user.name} />}
          </div>
          <div onClick={openChat} className="chatter-info">
            <h6>{chatperson.user.verified === "true" ? <img src="/icons/verified.svg"/> : null}{chatperson.user.name}</h6>
            <p>@{chatperson.user.username}</p>
          </div>
          <div className="chatter-menu">
            <button onClick={showOptions}>
              <IconDotsVertical id={chatperson.user.id} />
            </button>
            {showOpt ? <div className="chatter-options">
              <ul>
                <li><IconAlertTriangleFilled /> Report</li>
                <li><IconTrash /> Delete</li>
              </ul>
            </div> : null}
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