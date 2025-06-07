const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const socketIO = require('socket.io')

dotenv.config()  //Loading variables from .env
const app = express()  //Initializing express

//Middlewares
app.use(cors())
app.use(express.json())

//Loading routes
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')

//Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

//Connecting to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Database Connected'))
    .catch((err) => console.error('Database Connection Failed:', err));

//Realtime websocket connection
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const socketHandler = require('./sockets/socketManager')
socketHandler(io, app);

//Starting Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})