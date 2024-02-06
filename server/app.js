import express from "express";
import {createServer} from "http"
import { Server } from "socket.io";
import cors from "cors";

const port = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})
app.use(cors(
    {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
));

io.on("connection", (socket) => {
    console.log("User is connected", socket.id);

    socket.on("message", ({message, room})=>{
        console.log({message, room});
        socket.to(room).emit("receive-message", message);
    })

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log("user joined ", room);
    })

    socket.emit("welcome", `Welcome to the server`);
    socket.broadcast.emit("welcome", `${socket.id} user joined the server`);
    
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
    })
})

app.get("/", (req, res) => {
    res.send("Hello, world!!")
})

httpServer.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})