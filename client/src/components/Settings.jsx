import "./Settings.css";
import { useNavigate } from "react-router-dom";
import {useState,useEffect,useRef} from "react";

import {IconArrowLeft,IconChevronRight,IconUserCircle} from "@tabler/icons-react";

const Settings = () => {
  const navigate = useNavigate();
  const [changeTheme,setChangeTheme] = useState(false);
  return (
    <>
      <div className="settings-container">
        <div className="settings-nav">
          <IconArrowLeft onClick={()=>navigate("/")} />
          <h3>Settings</h3>
        </div>
        <div className="settings-body">
          <div className="settings-item" onClick={()=>setChangeTheme(prev => !prev)}>
            <div className="settings-item-info">
              <h5>Theme</h5>
              <p>Customize the chat</p>
            </div>
            <div className="settings-item-actions">
              <IconChevronRight />

            </div>
          </div>
          <ChangeTheme isActive={changeTheme} setIsActive={setChangeTheme}/>
          <div className="settings-item">
            <div className="settings-item-info">
              <h5>Set up Ringtone</h5>
              <p>sound or music for recieving calls</p>
            </div>
            <div className="settings-item-actions">
              <IconChevronRight />
            </div>
          </div>
          <div className="settings-item">
            <div className="settings-item-info">
              <h5>Dark Mode</h5>
              <p>reduce light glare and power use</p>
            </div>
            <div className="settings-item-actions">
              <ToggleButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ChangeTheme = ({isActive,setIsActive}) => {
  const colors = [
    ["#8E2DE2","#4A00E0"],
    ["#7F00FF","#E100FF"],
    ["#396afc","#2948ff"],
    ["#56ab2f","#a8e063"],
    ["#F00000","#DC281E"],
    ["#f85032","#e73827"]
  ];
  const contRef = useRef(null);
  
  const [colorChanged,setColorChanged] = useState(false)
  
  useEffect(()=>{
    if(isActive){
      contRef?.current.classList.add("show-setting-opt")
    }else{
      contRef?.current.classList.remove("show-setting-opt")
    }
  },[isActive]);
  
  useEffect(()=>{
    const colorIndex = getIndexByColor();
    const colorBoxes = document.querySelectorAll(".settings-change-theme-color");
    
    for(var i=0;i<colorBoxes;i++){
      colorBoxes[i].style.outline = "none";
    }
    
    colorBoxes[colorIndex].style.outline = "3px solid white";
  },[colorChanged])
  
  const root = document.querySelector(":root");
  const handleChangeColor = (index) => {
    root.style.setProperty("--primary-bg",`linear-gradient(45deg,${colors[index][0]},${colors[index][1]})`);
    root.style.setProperty("--primary-bg-color",colors[index][1]);
    setColorChanged(true);
  }
  
  const getIndexByColor = () => {
    const computedRoot = getComputedStyle(root);
    var currColors = computedRoot.getPropertyValue("--primary-bg").split("gradient(45deg,")[1];
    const finalColor = currColors.split(",")[0];
    
    for(var i = 0;i<colors.length;i++){
      if(finalColor === colors[i][0]){
        return i;
      }
    }
    
    return null;
  }
  
  return (
    <>
      <div className="settings-change-theme-container" ref={contRef}>
        <button onClick={()=>setIsActive(false)}>Done</button>
        <div className="settings-change-theme-nav">
          <IconArrowLeft />
          <IconUserCircle size={35} />
          <div className="settings-change-theme-user-info">
            <div style={{display:"flex",flexDirection:"column"
              ,gap:"0px"
            }}>
              <h6>Your Full Name</h6>
              <p>@username</p>
            </div>
          </div>
        </div>
        <div className="settings-change-theme-body">
          <div className="settings-change-theme-chat-box">
            <h5>Hello</h5>
            <p>9:10pm</p>
          </div>
          <div className="settings-change-theme-chat-box">
            <h5>Hi</h5>
            <p>9:12pm</p>
          </div>
        </div>
        <div className="settings-change-theme-colors">
          <div className="settings-change-theme-color" onClick={()=>handleChangeColor(0)}>
          </div>
          <div className="settings-change-theme-color" onClick={()=>handleChangeColor(1)}>
          </div>
          <div className="settings-change-theme-color" onClick={()=>handleChangeColor(2)}>
          </div>
          <div className="settings-change-theme-color" onClick={()=>handleChangeColor(3)}>
          </div>
          <div className="settings-change-theme-color" onClick={()=>handleChangeColor(4)}>
          </div>
          <div className="settings-change-theme-color" onClick={()=>handleChangeColor(5)}>
          </div>
        </div>
      </div>
    </>
  );
}

const ToggleButton = () => {
  const thumbRef = useRef(null);
  const root = document.querySelector(":root");
  const computedRoot = getComputedStyle(root);
  const bgColor = computedRoot.getPropertyValue("--bg");
  const [isActive,setIsActive] = useState(bgColor === "#111" ? true : false);
  useEffect(()=>{
    if(isActive){
      root.style.setProperty("--bg","#111");
      root.style.setProperty("--text","#fff");
      root.style.setProperty("--secondary-bg","#555");
      root.style.setProperty("--secondary-text","#fff");
      thumbRef?.current.classList.add("active");
    }else{
      root.style.setProperty("--bg","#fff");
      root.style.setProperty("--text","#111");
      root.style.setProperty("--secondary-bg","#eee");
      root.style.setProperty("--secondary-text","#111");
      thumbRef?.current.classList.remove("active");
    }
  },[isActive]);
  
  return (
    <>
      <div role="button" ref={thumbRef} className="toggle-button-container" onClick={()=>setIsActive(prev => !prev)}>
        <div className="toggle-button-thumb">
        </div>
      </div>
    </>
  )
}

export default Settings;