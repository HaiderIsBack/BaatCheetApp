import "./Profile.css";

import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../SocketContext";

import { IconUserCircle, IconArrowLeft } from "@tabler/icons-react";

const Profile = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(SocketContext);
  const [image, setImage] = useState(loggedInUser.image);
  const [name, setName] = useState(loggedInUser.name);
  const [username, setUsername] = useState(loggedInUser.username);
  const [email, setEmail] = useState(loggedInUser.email);

  const imgRef = useRef(null);
  const inputIMGRef = useRef(null);
  const formRef = useRef(null);

  const changeImage = () => {
    inputIMGRef.current.click();
    inputIMGRef.current.addEventListener("change", async (e) => {
      if (e.target.files.length > 0) {
        const formData = new FormData();

        for (const inputName in formRef.current) {
          formData.append(inputName, formRef.current[inputName]);
        }
        console.log("Form Data >>> ",formData.getAll())
        const res = await fetch("/api/v1/upload_image", {
          method: "POST",
          body: formData,
        });
        console.log(res)
      }
    });
  };

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
        <form ref={formRef}>
          <input type="text" name="userId" value={loggedInUser.userId} hidden />
          <input
            ref={inputIMGRef}
            type="file"
            name="image"
            accept="image/png, image/jpg, image/jpeg"
            hidden
          />
        </form>
        <h3 className="menu-heading">Name</h3>
        <input
          onChange={(e) => setName(e.target.value)}
          className="menu-input"
          value={name}
          type="text"
        />
        <h3 className="menu-heading">Username</h3>
        <input
          onChange={(e) => setUsername(e.target.value)}
          className="menu-input"
          value={username}
          type="text"
        />
        <h3 className="menu-heading">Email</h3>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="menu-input"
          value={email}
          type="text"
        />
      </div>
    </>
  );
};

export default Profile;
