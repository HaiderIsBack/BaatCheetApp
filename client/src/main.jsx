import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter,Navigate, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import PageNotFound from "./components/PageNotFound"
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import NewConversation from "./components/NewConversation"
import Profile from "./components/Profile"
import './index.css'
import { ContextProvider } from "./SocketContext"

const ProtectedRoute = ({children, auth=false}) => {
  const isLoggedIn = localStorage.getItem("user:token") || false
  if(!isLoggedIn && auth){
    return <Navigate to={"/login"} />;
  }else if(isLoggedIn && ["/login","/signup"].includes(window.location.pathname)){
    return <Navigate to={"/"} />
  }
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={
        <ProtectedRoute auth={true}>
          <ContextProvider>
            <Home />
          </ContextProvider>
        </ProtectedRoute>
        } />
        <Route exact path="/login" element={
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>} />
        <Route exact path="/signup" element={<ProtectedRoute>
          <Signup />
        </ProtectedRoute>} />
        <Route exact path="/chat" element={
         <ProtectedRoute auth={true}>
          <ContextProvider>
            <App />
          </ContextProvider>
         </ProtectedRoute>
        } />
        <Route path="/newconversation" element={<ProtectedRoute auth={true} >
            <ContextProvider>
              <NewConversation />
            </ContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={<ProtectedRoute auth={true} >
            <ContextProvider>
              <Profile />
            </ContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
)
