#!/bin/bash

echo "===================================="
echo "Starting Solar Panel Applications"
echo "===================================="

# Stop existing PM2 processes
echo "Stopping existing PM2 processes..."
pm2 stop all

# Install dependencies
echo "Installing dependencies..."
npm install

# Build applications
echo "Building applications..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "===================================="
    echo "Error: Build failed!"
    echo "===================================="
    exit 1
fi

# Start with PM2
echo ""
echo "Starting applications with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
echo ""
echo "Saving PM2 configuration..."
pm2 save

# Show status
echo ""
echo "===================================="
echo "Applications started successfully!"
echo "===================================="
echo ""
pm2 status

echo ""
echo "View logs with: pm2 logs"
echo "Monitor with: pm2 monit"
