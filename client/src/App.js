import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
//import {SocketContext, socket} from 'socket';
import socketio from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";

function App() {
  const [socket, setSocket] = useState(undefined);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([])

  const handleClick = () => {
    let s = socketio.connect(ENDPOINT);

    s.on("new_user", handleNewUser); 
    s.on("users", handleUsers); 
    s.on("user_disconnected", handleUserDisconnect); 

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

  return (
      <div className="App">
        <header className="App-header">
          { socket === undefined ?
          <div>
            <input value={username} onChange={(e) => {setUsername(e.target.value)}}/>
            <button onClick={handleClick}>Connect</button>
          </div>
          :
          <div>
            {
              users.map((user) => {
                return <h1 key={user}>{user}</h1>
              })
            }
          </div>
          }
          {

          }
        </header>
      </div>
  );
}

export default App;