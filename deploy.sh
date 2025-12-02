#!/bin/bash

echo "===================================="
echo "Deploying to EC2 Server..."
echo "===================================="

SSH_KEY="../pk.pem"
SERVER="ubuntu@ec2-13-232-231-175.ap-south-1.compute.amazonaws.com"
REMOTE_PATH="/home/ubuntu/SolarPanel"

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to script directory
cd "$SCRIPT_DIR"

echo "Syncing files (excluding .gitignore patterns)..."

rsync -avz --progress \
  --exclude-from='.gitignore' \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='dist/' \
  --exclude='.next/' \
  --exclude='.turbo/' \
  --exclude='*.log' \
  --exclude='.env.local' \
  -e "ssh -i $SSH_KEY" \
  ./ \
  $SERVER:$REMOTE_PATH

if [ $? -ne 0 ]; then
    echo ""
    echo "===================================="
    echo "Error: Deployment failed!"
    echo "===================================="
    exit 1
fi

echo ""
echo "===================================="
echo "Deployment completed successfully!"
echo "===================================="
echo ""
echo "Run the following commands on server:"
echo "  cd /home/ubuntu/SolarPanel"
echo "  npm install"
echo "  npm run build"
echo "  pm2 restart all"
echo ""
