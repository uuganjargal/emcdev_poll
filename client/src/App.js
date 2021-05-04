import './App.css';
import React, { useState } from "react";
//import {SocketContext, socket} from 'socket';
import socketio from "socket.io-client";
import moment from 'moment'

const ENDPOINT = "/";

function App() {
  const [socket, setSocket] = useState(undefined);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([])
  const [time, setTime] = useState('')
  const [chat, setChat] = useState('')
  const [chats, setChats] = useState([])

  const handleClick = () => {
    let s = socketio.connect(ENDPOINT, {'path': '/api/socket.io'});

    s.on("new_user", handleNewUser); 
    s.on("users", handleUsers); 
    s.on("user_disconnected", handleUserDisconnect); 

    s.on("timer", handleTime); 
    s.on("new_message", handleMessage); 

    s.emit('username', username);

    setSocket(s)
  }

  const handleUserDisconnect = (data) => {
    setUsers(data.users)
  }

  const handleNewUser = (data) => {
    console.log('new user',data)
    setUsers(data.users)
  }

  const handleUsers = (data) => {
    setUsers(data)
  }

  const handleTime = (data) => {
    let t = moment(data);
    setTime(t.format('hh:mm:ss'))
  }

  const handleChat = () => {
    socket.emit('message', chat)
  }

  const handleMessage = (data) => {
    //console.log(chats)
    //let newchat = [...chats, data]
    //console.log(newchat)
    //setChats(newchat)
    setChats((oldchats) => [...oldchats, data]);
  }

  return (
      <div className="App">
        <header className="App-header">
          <h2>Hello!</h2>
          { socket === undefined ?
          <div>
            <input value={username} onChange={(e) => {setUsername(e.target.value)}}/>
            <button onClick={handleClick}>Connect</button>
          </div>
          :
          <div>
            {
              users.map((user) => {
                return <h4 key={user}>{user}</h4>
              })
            }
            <p>{time}</p>
            <div>
              <input value={chat} onChange={(e) => {setChat(e.target.value)}}/>
              <button onClick={handleChat}>Send</button>
            </div>
            <ul>
            {
              chats.map((chat) => {
                return <li key={chat.key}>{chat.username} {chat.text}</li>
              })
            }
            </ul>
          </div>
          }
            
        </header>
      </div>
  );
}

export default App;
