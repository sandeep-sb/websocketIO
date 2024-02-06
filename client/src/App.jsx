import React, { useEffect, useMemo, useState } from "react"
import {io} from "socket.io-client"
import {Container, Typography, TextField, Button, Stack} from "@mui/material"

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("")
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [joinRoom, setJoinRoom] = useState("");
  
  const socket = useMemo(() => io("https://urban-disco-p6vrv4pwx652r6wx-3000.app.github.dev/"), []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("");
    setRoom("");
  }

  const handleJoinRoomSubmit = (e) => {
    e.preventDefault();
    socket.emit("join-room", joinRoom);
    setJoinRoom("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected : ", socket.id)
      setSocketID(socket.id);
    })

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages(messages => [...messages, data]);
    })

    return ()=>{
      socket.disconnect();
    }

  }, []);

  return (
    <>
      <Container>
        <Typography variant="h6" component="h2" gutterBottom>
          Welcome to socket.io {socketID}
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Room : {joinRoom}
        </Typography>
      </Container>

      <form onSubmit={handleJoinRoomSubmit}>
        <TextField 
            value={joinRoom} 
            onChange={(e) => setJoinRoom(e.target.value)} 
            id="outlined-basic" 
            label="Join Room" 
            variant="outlined" 
          />
        <Button type="submit" variant="contained" color="primary">Join</Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          id="outlined-basic" 
          label="Message" 
          variant="outlined" 
        />
        <TextField 
          value={room} 
          onChange={(e) => setRoom(e.target.value)} 
          id="outlined-basic" 
          label="Room" 
          variant="outlined" 
        />
        <Button type="submit" variant="contained" color="primary">Send</Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>

    </>
  )
}

export default App
