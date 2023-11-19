import "./Profile.css"

import {useState, useRef} from 'react'
import {useNavigate} from "react-router-dom"

import {IconUserCircle,IconArrowLeft} from "@tabler/icons-react"

const Profile = () => {
  const navigate = useNavigate()
  const image = undefined
  const [name,setName] = useState("Hammad")
  const [username,setUsername] = useState("@hammad1122")
  
  const imgRef = useRef(null)
  const inputIMGRef = useRef(null)
  const formRef = useRef(null)
  
  const changeImage = () => {
    inputIMGRef.current.click()
    inputIMGRef.current.addEventListener("change",(e)=>{
      if(e.target.files.length > 0){
        formRef.current.submit()
      }
    })
  }
  return (
    <>
      <div className="menu-page-container">
        <IconArrowLeft onClick={()=>navigate("/")} className="menu-back-btn" />
        {image === undefined ? <IconUserCircle onClick={changeImage} className="menu-user-img" />
        :
        <img ref={imgRef} onClick={changeImage} className="menu-user-img" src={image} />}
        <form ref={formRef} encType="multipart/form-data" action="/api/v1/upload_image" method="POST">
          <input ref={inputIMGRef} type="file" name="image" accept="image/png, image/jpg, image/jpeg" hidden />
        </form>
        <h3 className="menu-heading">Name</h3>
        <input onChange={(e)=>setName(e.target.value)} className="menu-input" value={name} type="text" />
        <h3 className="menu-heading">Username</h3>
        <input onChange={(e)=>setUsername(e.target.value)} className="menu-input" value={username} type="text" />
        
      </div>
    </>
  )
}

export default Profile