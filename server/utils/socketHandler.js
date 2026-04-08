const { Server } = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('setup', (userId) => {
        socket.join(userId);      // room for direct messages
        socket.join('all-students'); // general notifications room
        console.log(`User ${userId} joined their rooms`);
      });

      socket.on('join-branch-year', ({ branch, year }) => {
        if (branch) socket.join(`branch-${branch}`);
        if (year) socket.join(`year-${year}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
