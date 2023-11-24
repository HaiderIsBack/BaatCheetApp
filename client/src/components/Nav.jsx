import "./Nav.css";
import { useNavigate } from "react-router-dom";

import {
  IconArrowLeft,
  IconUserCircle,
  IconVideo,
  IconPhone,
} from "@tabler/icons-react";

const Nav = ({ chatter }) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
  return (
    <>
      <div className="nav-container">
        <div onClick={goBack} className="nav-back-btn">
          <IconArrowLeft />
        </div>
        <div className="nav-user-info">
          {chatter.image === undefined ? (
            <IconUserCircle width={50} height={50} />
          ) : (
            <img src={chatter.image} alt={chatter.name} />
          )}
          <div className="nav-user">
            <h6>{chatter.name}</h6>
            <p>@{chatter.username}</p>
          </div>
        </div>
        <div className="nav-video-call">
          <IconVideo />
        </div>
        <div className="nav-call">
          <IconPhone />
        </div>
      </div>
    </>
  );
};

export default Nav;
