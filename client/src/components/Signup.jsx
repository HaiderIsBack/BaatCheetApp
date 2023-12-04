import "./Signup.css"

import {Link, useNavigate} from "react-router-dom"

import { useState, useRef } from "react"

const Signup = () => {
  const navigate = useNavigate()
  //States
  const [uname,setUName] = useState("")
  const [passcode,setPassCode] = useState("")
  const [confirmPasscode,setConfirmPassCode] = useState("")
  const [email,setEmail] = useState("")
  const [name,setName] = useState("")
  const [errType,setErrType] = useState("")
  //References
  const errorRef = useRef(null)
  const unameRef = useRef(null)
  const passcodeRef = useRef(null)
  const confirmPasscodeRef = useRef(null)
  const emailRef = useRef(null)
  const nameRef = useRef(null)
  //Handles
  const handleUsername = (e) => {
    setUName(e.target.value.toLowerCase())
    unameRef.current.style.borderColor = "#2948DD"
    if(errType === "uname"){
      errorRef.current.innerText = ""
      setErrType("")
    }
  }
  
  const handlePasscode = (e) => {
    setPassCode(e.target.value)
    passcodeRef.current.style.borderColor = "#2948DD";
    if(errType === "passcode"){
      errorRef.current.innerText = ""
      setErrType("")
    }
  }
  
  const handleConfirmPasscode = (e) => {
    setConfirmPassCode(e.target.value)
    confirmPasscodeRef.current.style.borderColor = "#2948DD"
    if(errType === "cpasscode"){
      errorRef.current.innerText = ""
      setErrType("")
    }
  }
  
  const handleEmail = (e) => {
    setEmail(e.target.value)
    emailRef.current.style.borderColor = "#2948DD"
    if(errType === "email"){
      errorRef.current.innerText = ""
      setErrType("")
    }
  }
  
  const handleName = (e) => {
    setName(e.target.value)
    nameRef.current.style.borderColor = "#2948DD"
    if(errType === "name"){
      errorRef.current.innerText = ""
      setErrType("")
    }
  }
  //*Handle Submit*//
  const handleSubmit = async (e) => {
    e.preventDefault()
    //Name Check
    if(name.trim() === ""){
      nameRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Please enter Your Full Name!"
      setErrType("name")
      return
    }
    //Email Check
    if(email.trim() === ""){
      emailRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Please enter Your Email!"
      setErrType("email")
      return
    }
    //Username Check
    if(uname.trim() === ""){
      unameRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Please enter an Username!"
      setErrType("uname")
      return
    }
    //Password Check
    if(passcode.trim() === ""){
      passcodeRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Please enter Password!"
      setErrType("passcode")
      return
    }
    if(passcode.length < 8){
      passcodeRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Password Length must be at least 8 characters!"
      setErrType("passcode")
      return
    }
    //Confirm Password Check
    if(confirmPasscode.trim() === ""){
      confirmPasscodeRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Please enter Password!"
      setErrType("cpasscode")
      return
    }
    if(confirmPasscode.length < 8){
      confirmPasscodeRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Password Length must be at least 8 characters!"
      setErrType("cpasscode")
      return
    }
    if(confirmPasscode !== passcode){
      confirmPasscodeRef.current.style.borderColor = "crimson";
      errorRef.current.innerText = "Passwords are not matching!"
      setErrType("cpasscode")
      return
    }
    
    const payload = {
      name: name,
      email: email,
      username: uname,
      password: passcode
    }
    
    const res = await fetch("/api/v1/signup",{
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
      errorRef.current.innerText = "Email or Username already exists in our system"
      return
    }else{
      navigate("/login")
    }
  }
  return (
      <>
        <div className="login-container">
          <div className="design-box">
          </div>
          <div className="design-box">
          </div>
          <h2>Sign Up</h2>
          <form>
            {/*Full Name*/}
            <fieldset ref={nameRef}>
              <legend>Full Name</legend>
              <input onChange={handleName} value={name} type="text" placeholder="e.g Muhammad Tariq"/>
            </fieldset>
            {/*Email*/}
            <fieldset ref={emailRef}>
              <legend>Email</legend>
              <input onChange={handleEmail} value={email} type="text" placeholder="e.g example@mail.com"/>
            </fieldset>
            {/*Username*/}
            <fieldset ref={unameRef}>
              <legend>Username</legend>
              <input onChange={handleUsername} value={uname} type="text" placeholder="Must be unique"/>
            </fieldset>
            {/*Password*/}
            <fieldset ref={passcodeRef}>
              <legend>Password</legend>
              <input onChange={handlePasscode} value={passcode} type="password" placeholder="At least 8 characters long"/>
            </fieldset>
            {/*Confirm Password*/}
            <fieldset ref={confirmPasscodeRef}>
              <legend>Confirm Password</legend>
              <input onChange={handleConfirmPasscode} value={confirmPasscode} type="password" placeholder="At least 8 characters long"/>
            </fieldset>
            <p>Already have an account <Link to={"/login"} >Login</Link></p>
            <div ref={errorRef} id="error-prompt"></div>
            <button onClick={handleSubmit}>Create Account</button>
          </form>
        </div>
      </>
    )
}

export default Signup