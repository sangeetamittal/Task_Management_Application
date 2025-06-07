const userSocketMap = {} //It stores userID with socketID

const socketHandler = (io, app) => {

    io.on('connection', (socket) => {
        console.log('New user connected:', socket.id);

        //registering when a user comes online
        socket.on('register', (userId) => {
            userSocketMap[userId] = socket.id;
            console.log(`Registered user ${userId} to socket ${socket.id}`);
        });

        //Disconnecting when a user goes offline
        socket.on('disconnect', () => {
            const userId = Object.keys(userSocketMap).find(
                key => userSocketMap[key] === socket.id
            )
            if (userId) {
                delete userSocketMap[userId];
                console.log(`User ${userId} disconnected`)
            }
        });

    });

    app.set('io', io);
    app.set('userSocketMap', userSocketMap);
};

module.exports = socketHandler;