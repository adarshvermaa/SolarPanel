#!/bin/bash

echo "===================================="
echo "Restarting Solar Panel Applications"
echo "===================================="

# Rebuild applications
echo "Rebuilding applications..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "===================================="
    echo "Error: Build failed!"
    echo "===================================="
    exit 1
fi

# Restart PM2
echo ""
echo "Restarting PM2 processes..."
pm2 restart all

# Show status
echo ""
echo "===================================="
echo "Applications restarted successfully!"
echo "===================================="
echo ""
pm2 status

echo ""
echo "View logs with: pm2 logs"
