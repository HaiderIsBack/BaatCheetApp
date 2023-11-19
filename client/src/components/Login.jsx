import "./Login.css"

import {Link, useNavigate} from "react-router-dom"

import { useState, useRef } from "react"

const Login = () => {
  const navigate = useNavigate()
  
  const [uname,setUName] = useState("")
  const [passcode,setPassCode] = useState("")
  const [errType,setErrType] = useState("")
  
  const errorRef = useRef(null)
  const unameRef = useRef(null)
  const passcodeRef = useRef(null)
  
  const handleUsername = (e) => {
    setUName(e.target.value)
    unameRef.current.style.borderColor = "#e73827"
    if(errType === "uname"){
      errorRef.current.innerText = ""
      setErrType("")
    }
  }
  
  const handlePasscode = (e) => {
    setPassCode(e.target.value)
    passcodeRef.current.style.borderColor = "#e73827";
    if(errType === "passcode"){
      errorRef.current.innerText = ""
      setErrType("")
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(uname.trim() === ""){
      unameRef.current.style.borderColor = "orange";
      errorRef.current.innerText = "Please enter Username!"
      setErrType("uname")
      return
    }
    if(passcode.trim() === ""){
      passcodeRef.current.style.borderColor = "orange";
      errorRef.current.innerText = "Please enter Password!"
      setErrType("passcode")
      return
    }
    if(passcode.length < 8){
      passcodeRef.current.style.borderColor = "orange";
      errorRef.current.innerText = "Password Length must be at least 8 characters!"
      setErrType("passcode")
      return
    }
    const payload = {
      username: uname,
      password: passcode
    }
    const res = await fetch("/api/v1/login",{
    // Adding method type
    method: "POST",
    // Adding body or contents to send
    body: JSON.stringify(payload),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    });
    if(res.status !== 200){
      res.json().then((data)=>{
        errorRef.current.innerText = data.msg
      })
      return
    }else{
      res.json().then((data)=>{
        localStorage.setItem("user:details",JSON.stringify(data.user))
        localStorage.setItem("user:token",data.token)
        navigate("/")
      }).catch((e)=>{
        console.log("Error Detected.",e)
      })
    }
  }
  return (
      <>
        <div className="login-container">
          <div className="design-boxes">
            <div className="design-box">
            </div>
            <div className="design-box">
            </div>
            <div className="design-box">
            </div>
          </div>
          <h2>Login</h2>
          <form>
            <fieldset ref={unameRef}>
              <legend>Username</legend>
              <input onChange={handleUsername} value={uname} type="text" />
            </fieldset>
            <fieldset ref={passcodeRef}>
              <legend>Password</legend>
              <input onChange={handlePasscode} value={passcode} type="password" />
            </fieldset>
            <p>Didn't have an account <Link to={"/signup"} >Create One</Link></p>
            <div ref={errorRef} id="error-prompt"></div>
            <button onClick={handleSubmit}>Login</button>
          </form>
        </div>
      </>
    )
}

export default Login