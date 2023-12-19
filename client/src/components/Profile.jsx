import "./Profile.css";
//import "bootstrap/dist/css/bootstrap.css"

import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../SocketContext";

import { IconCamera,IconUserEdit,IconUser,IconMail,IconAlertTriangleFilled,IconUserCircle, IconArrowLeft } from "@tabler/icons-react";

const Profile = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(SocketContext);
  const [isChanged,setIsChanged] = useState(false);
  const [errorOccured,setErrorOccured] = useState(false);
  var [image, setImage] = useState(loggedInUser.image);
  const [originalData,setOriginalData] = useState({
    name: loggedInUser.name,
    username: loggedInUser.username,
    email: loggedInUser.email
  })
  const [name, setName] = useState(loggedInUser.name);
  const [username, setUsername] = useState(loggedInUser.username);
  const [email, setEmail] = useState(loggedInUser.email);

  const imgRef = useRef(null);
  const inputIMGRef = useRef(null);
  const inputUserRef = useRef(null);
  const errorRef = useRef(null);

  const changeImage = () => {
    const userToken = localStorage.getItem("user:token")
    inputIMGRef.current.click();
    inputIMGRef.current.addEventListener("change", async (e) => {
      if (e.target.files.length > 0) {
        const formData = new FormData();

        formData.append("userId",inputUserRef.current.value)
        formData.append("image",e.target.files[0])
        
        fetch("/api/v1/upload_image", {
          method: "POST",
          body: formData,
          headers: {
            authorization: userToken
          }
        }).then((res)=>{
          if(res.status === 400){
            alert("File is too Large...! (Must be Less than 2Mb)")
          }else if(res.status === 200){
            return res.json()
          }
        }).then((data)=>{
          setImage(data.image)
          const loggedInUser = JSON.parse(localStorage.getItem("user:details"))
          loggedInUser.image = data.image
          localStorage.setItem("user:details",JSON.stringify(loggedInUser))
          navigate("/profile")
        }).catch((err)=>{
          console.log(err)
        })
        
      }
    });
  };

  const updateInfo = () => {
    const userToken = localStorage.getItem("user:token")
    const userData = {
      userId: loggedInUser.userId,
      name: name,
      username: username,
      email: email
    }
    fetch("/api/v1/user",{
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: userToken
      }
    })
    .then(async (res)=>{
      setIsChanged(false)
      if(!res.ok){
        if(res.status === 400){
          const err = await res.json();
          setErrorOccured(true);
          errorRef.current.innerText = err.msg;
          console.log("Err Msg: ",err)
        }
        if(res.status === 406){
          const err = await res.json();
          setErrorOccured(true);
          errorRef.current.innerText = err.msg
          console.log("Err Msg: ",err)
        }
        cancelUpdate();
      }else{
        return res.json()
      }
    })
    .then((data)=>{
      const userDetails = JSON.parse(localStorage.getItem("user:details"));
      userDetails.name = data.name
      userDetails.username = data.username
      userDetails.email = data.email
      localStorage.setItem("user:details",JSON.stringify(userDetails))
      setIsChanged(false)
      setErrorOccured(false)
      setOriginalData({
        name: data.name,
        username: data.username,
        email: data.email
      })
    })
  }

  const cancelUpdate = () => {
    setName(originalData.name)
    setUsername(originalData.username)
    setEmail(originalData.email)
    setIsChanged(false)
  }

  return (
    <>
      <div className="menu-page-container">
        <IconArrowLeft
          onClick={() => navigate("/")}
          className="menu-back-btn"
        />
        {image === undefined ? (
        <div className="menu-user-img-container" onClick={changeImage}>
          <IconUserCircle className="menu-user-img" />
          <div className="camera-icon">
            <IconCamera size={40} />
          </div>
        </div>
        ) : ( <div className="menu-user-img-container" onClick={changeImage}>
          <img
            ref={imgRef}
            className="menu-user-img"
            src={image}
          />
          <div className="camera-icon"><IconCamera size={40} /></div>
        </div>
        )}
          <input ref={inputUserRef} type="text" name="userId" value={loggedInUser.userId} readOnly hidden />
          <input
            ref={inputIMGRef}
            type="file"
            name="image"
            accept="image/png, image/jpg, image/jpeg"
            hidden
          />
        <h5 className="menu-heading"><IconUser /> Name</h5>
        <input
          onChange={(e) => {setName(e.target.value); setIsChanged(true)}}
          className="menu-input"
          value={name}
          type="text"
        />
        <h5 className="menu-heading"><IconUserEdit /> Username</h5>
        <input
          onChange={(e) => {setUsername(e.target.value); setIsChanged(true)}}
          className="menu-input"
          value={username}
          type="text"
        />
        <h5 className="menu-heading"><IconMail /> Email</h5>
        <input
          onChange={(e) => {setEmail(e.target.value); setIsChanged(true)}}
          className="menu-input"
          value={email}
          type="email"
        />
        
        { isChanged ? <div className="row profile-manipulation-btns" style={{width:"100%"}}>
          <button className="profile-save-btn" onClick={updateInfo}>Save</button>
          
          <button className="profile-cancel-btn" onClick={cancelUpdate}>Cancel</button>
        </div> : null }

        
      </div>
      <div style={{display: errorOccured ? "flex": "none"}} className="profile-error-prompt">
          <IconAlertTriangleFilled />
          <div ref={errorRef}></div>
      </div>
      {isChanged ? <div style={{height:"100px", background:"var(--primary-bg)"}}></div> : null}
    </>
  );
};

export default Profile;
