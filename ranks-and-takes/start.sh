#!/bin/bash

# Start both frontend and backend servers

echo "Starting Ranks & Takes application..."
echo ""

# Start backend server
echo "Starting backend server on port 5000..."
npm run server &
BACKEND_PID=$!

# Give backend time to start
sleep 2

# Start frontend
echo "Starting frontend on port 3000..."
npm start &
FRONTEND_PID=$!

echo ""
echo "Application started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "API Documentation: See SERVER_README.md"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
