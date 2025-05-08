const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Sample risk data (replace with database in production)
let riskData = [
  {
    id: 1,
    category: 'Operational',
    description: 'System Downtime',
    severity: 'High',
    probability: 0.7,
    impact: 0.8,
    timestamp: new Date(),
    mitigation: 'Implement redundant systems and regular maintenance schedule'
  },
  // Add more sample data as needed
];

// API Routes
app.get('/api/risks', (req, res) => {
  res.json(riskData);
});

app.post('/api/risks', (req, res) => {
  const newRisk = {
    id: riskData.length + 1,
    ...req.body,
    timestamp: new Date()
  };
  riskData.push(newRisk);
  io.emit('riskUpdate', riskData);
  res.json(newRisk);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('initialData', riskData);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
