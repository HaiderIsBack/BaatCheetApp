import "./App.css";
import { IconSend, IconMicrophone,IconCheck , IconChecks,IconLock } from "@tabler/icons-react";
import BarLoader from "react-spinners/BarLoader";

import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "./SocketContext";

import Nav from "./components/Nav";

const timeAdjust = (time) => {
  var hour, minute, n;
  hour = new Date(time).getHours();
  minute = new Date(time).getMinutes();
  if (hour >= 12) {
    n = "pm";
    if (hour > 12) {
      hour = hour - 12;
    }
  } else {
    n = "am";
    if (hour == 0) {
      hour = 12;
    }
  }
  hour = hour.toString();
  if (minute < 10) {
    minute = minute.toString();
    minute = "0" + minute;
  } else {
    minute = minute.toString();
  }
  return hour + ":" + minute + " " + n;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatter = location.state.chatter;

  const [messages, setMessages] = useState([]);
  const [loading,setLoading] = useState(false)

  const { loggedInUser, socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setMessages((prev) => {
        return [
          ...prev,
          { user: data.user, message: data.message, time: data.time },
        ];
      });
    });
    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  useEffect(() => {
    const userToken = localStorage.getItem("user:token")
    const user = JSON.parse(localStorage.getItem("user:details"))
    const fetchMessages = async () => {
      setLoading(true);
      if(chatter.conversationId === undefined){
        fetch(`/api/v1/message?senderId=${user.userId}&receiverId=${chatter.user.id}`,{
          headers: {
            authorization: userToken
          }
        })
        .then((res)=>{
          setLoading(false)
          if(!res.ok){
            
          }else{
            return res.json()
          }
        })
        .then((data)=>{
          chatter.conversationId = data.conversationId
          if(data.messages !== undefined){
            setMessages(data.messages)
          }else{
            setMessages(data)
          }
        })
        return;
      }
      fetch(`/api/v1/message?conversationId=${chatter.conversationId}&receiverId=${chatter.user.id}`,{
        headers: {
          authorization: userToken
        }
      })
      .then((res)=>{
        setLoading(false)
        if(!res.ok){
          navigate("/")
        }else{
          return res.json()
        }
      })
      .then((data)=>{
        setMessages(data)
      })
      
    };
    fetchMessages();
  }, []);

  const generateMsg = async (data) => {
    const userToken = localStorage.getItem("user:token")
    var convoId = chatter.conversationId
    if(convoId === undefined){
      convoId = "new"
    }
    const payload = {
      conversationId: convoId,
      senderId: loggedInUser.userId,
      receiverId: data.receiverId,
      message: data.msg,
      status: data.status,
      time: data.time,
    };
    socket.emit("sendMessage", payload);
    await fetch("/api/v1/message", {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: JSON.stringify(payload),
      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: userToken
      },
    });
  };
  return (
    <>
      <Nav chatter={chatter.user} />
      <Messages msgs={messages} loading={loading} />
      <MessageBox chatter={chatter.user} onSubmit={generateMsg} />
    </>
  );
};

const Messages = (props) => {
  const msgContRef = useRef(null);

  useEffect(() => {
    msgContRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [props.msgs]);
  const user = JSON.parse(localStorage.getItem("user:details"));

  return (
    <>
      <div className="container" ref={msgContRef}>
              {props.loading ? <div className="myLoading">
        <BarLoader
        color={"var(--primary-bg-color)"}
        loading={props.loading}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
        </div> : null }
        {props.msgs.length > 0 ? (
          <div className="encryption-msg">
            <p><IconLock /> Your conversation is End-to-End Encrypted</p>
          </div>
        ) : null}
        {props.msgs.length > 0 ? props.msgs.map((msg, i) => {
          if (msg.user.id === user.userId) {
            return (
              <>
                {" "}
                <MyMessage
                  key={i}
                  msg={msg.message}
                  time={timeAdjust(msg.time)}
                />
                <div ref={msgContRef}></div>
              </>
            );
          } else {
            return (
              <>
                {" "}
                <TheirMessage
                  key={i}
                  msg={msg.message}
                  time={timeAdjust(msg.time)}
                />
                <div ref={msgContRef}></div>
              </>
            );
          }
        }) : <div className="no-messages">
          <h3>Say Hi!</h3>
        </div>}
      </div>
    </>
  );
};

const MessageBox = (props) => {
  const [msg, setMsg] = useState("");
  const handleMsg = (e) => {
    e.preventDefault();
    if (msg.trim() === "") return;
    const prepMsg = {
      receiverId: props.chatter.id,
      msg: msg,
      time: new Date().getTime(),
      status: "unread",
    };
    setMsg("");
    props.onSubmit(prepMsg);
  };

  return (
    <>
      <div className="msg-box">
        <form>
          <input
            type="text"
            placeholder="Message"
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
          />
          {msg.trim() !== "" ? (
            <button type="submit" onClick={handleMsg}>
              <IconSend />
            </button>
          ) : (
            <button>
              <IconMicrophone />
            </button>
          )}
        </form>
      </div>
    </>
  );
};

const MyMessage = ({ msg, time }) => {
  return (
    <div className="my-msg-wrapper">
      <p className="my-msg">
        {msg}
        <br />
        <div className="msg-info">
          <IconCheck />
          <span>{time}</span>
        </div>
      </p>
    </div>
  );
};

const TheirMessage = ({ msg, time }) => {
  return (
    <div className="their-msg-wrapper">
      <p className="their-msg">
        {msg}
        <br />
        <div className="msg-info2">
          <span>{time}</span>
        </div>
      </p>
    </div>
  );
};

export default App;