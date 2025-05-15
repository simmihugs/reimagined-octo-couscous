#!/bin/bash

# Start backend
cd localllm
source venv/bin/activate
python api/main.py &
BACKEND_PID=$!
cd ..

# Start frontend
bun run dev --host &

# Wait for backend to finish (optional)
wait $BACKEND_PID
