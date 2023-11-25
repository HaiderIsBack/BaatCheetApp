import "./Profile.css";
import "bootstrap/dist/css/bootstrap.css"

import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../SocketContext";

import { IconUserCircle, IconArrowLeft } from "@tabler/icons-react";

const Profile = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(SocketContext);
  const [isChanged,setIsChanged] = useState(false)
  var [image, setImage] = useState(loggedInUser.image);
  const [name, setName] = useState(loggedInUser.name);
  const [username, setUsername] = useState(loggedInUser.username);
  const [email, setEmail] = useState(loggedInUser.email);

  const imgRef = useRef(null);
  const inputIMGRef = useRef(null);
  const inputUserRef = useRef(null);

  const changeImage = () => {
    inputIMGRef.current.click();
    inputIMGRef.current.addEventListener("change", async (e) => {
      if (e.target.files.length > 0) {
        const formData = new FormData();

        formData.append("userId",inputUserRef.current.value)
        formData.append("image",e.target.files[0])
        
        fetch("/api/v1/upload_image", {
          method: "POST",
          body: formData,
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
          location.reload()
        }).catch((err)=>{
          console.log(err)
        })
        
      }
    });
  };

  const updateInfo = () => {
    const userData = {
      name: name,
      username: username,
      email: email
    }
    fetch("/api/v1/user",{
      method: "PATCH",
      body: userData
    })
  }

  const cancelUpdate = () => {
    location.reload()
  }

  return (
    <>
      <div className="menu-page-container">
        <IconArrowLeft
          onClick={() => navigate("/")}
          className="menu-back-btn"
        />
        {image === undefined ? (
          <IconUserCircle onClick={changeImage} className="menu-user-img" />
        ) : (
          <img
            ref={imgRef}
            onClick={changeImage}
            className="menu-user-img"
            src={image}
          />
        )}
          <input ref={inputUserRef} type="text" name="userId" value={loggedInUser.userId} readOnly hidden />
          <input
            ref={inputIMGRef}
            type="file"
            name="image"
            accept="image/png, image/jpg, image/jpeg"
            hidden
          />
        <h5 className="menu-heading">Name</h5>
        <input
          onChange={(e) => {setName(e.target.value); setIsChanged(true)}}
          className="menu-input"
          value={name}
          type="text"
        />
        <h5 className="menu-heading">Username</h5>
        <input
          onChange={(e) => {setUsername(e.target.value); setIsChanged(true)}}
          className="menu-input"
          value={username}
          type="text"
        />
        <h5 className="menu-heading">Email</h5>
        <input
          onChange={(e) => {setEmail(e.target.value); setIsChanged(true)}}
          className="menu-input"
          value={email}
          type="text"
        />
        { isChanged ? <div className="row profile-manipulation-btns" style={{width:"100%"}}>
          <div className="col-6">
            <button className="btn btn-primary btn-block shadow" onClick={updateInfo}>Save Changes</button>
          </div>
          <div className="col-6">
            <button className="btn btn-danger btn-block shadow" onClick={cancelUpdate}>Cancel Changes</button>
          </div>
        </div> : null }

        
      </div>
      {isChanged ? <div style={{height:"100px"}}></div> : null}
    </>
  );
};

export default Profile;
