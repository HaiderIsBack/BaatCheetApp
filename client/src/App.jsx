import "./App.css";
import { IconSend, IconMicrophone, IconChecks } from "@tabler/icons-react";

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
    const fetchMessages = async () => {
      const res = await fetch(`/api/v1/message/${chatter.conversationId}`);
      if (res.status !== 200) {
        navigate("/");
      } else {
        res.json().then((data) => {
          setMessages(data);
        });
      }
    };
    fetchMessages();
  }, []);

  const generateMsg = async (data) => {
    const payload = {
      conversationId: chatter.conversationId,
      senderId: loggedInUser.userId,
      receiverId: data.receiverId,
      message: data.msg,
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
      },
    });
  };
  return (
    <>
      <Nav chatter={chatter.user} />
      <Messages msgs={messages} />
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
        {props.msgs.map((msg, i) => {
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
        })}
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
          <IconChecks />
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
