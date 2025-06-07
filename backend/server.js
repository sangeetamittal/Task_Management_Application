const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const socketIO = require('socket.io')

dotenv.config()  //Loading variables from .env
const app = express()  //Initializing express

//Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json())

//Loading routes
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const userRoutes = require('./routes/userRoutes')

//Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/users', userRoutes)

//Connecting to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.error('Database Connection Failed:', err));

//Realtime websocket connection
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const socketHandler = require('./sockets/socketManager')
socketHandler(io, app);

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
  process.exit(1); // crash safely
});

app.get('/', (req, res) => {
  res.send('Server is running.');
});

//Starting Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

module.exports = app;