#!/bin/bash

# ==========================================
# 🚀 Manual Deployment Script (Local -> EC2)
# ==========================================

# --- CONFIGURATION (UPDATE THESE) ---
# Replace these with your actual details or export them as environment variables
EC2_HOST="${EC2_HOST:-YOUR_EC2_IP_ADDRESS}"
EC2_USER="${EC2_USER:-ubuntu}"
KEY_PATH="${KEY_PATH:-path/to/your/key.pem}" 
REMOTE_DIR="/var/www/solar-platform"

# --- VALIDATION ---
if [ "$EC2_HOST" == "YOUR_EC2_IP_ADDRESS" ]; then
    echo "❌ Error: Please update EC2_HOST in the script or set the environment variable."
    exit 1
fi

if [ ! -f "$KEY_PATH" ]; then
    echo "❌ Error: SSH key file not found at $KEY_PATH"
    echo "   Please update KEY_PATH in the script."
    exit 1
fi

echo "🚀 Starting deployment to $EC2_USER@$EC2_HOST..."

# 1. PREPARE DEPLOY PACKAGE
# We create a tarball excluding node_modules, git, env files, etc.
echo "📦 Packaging code..."
TAR_NAME="solar_deploy_$(date +%s).tar.gz"

# Using tar to exclude ignored files (closest manual way to 'skip gitignore' without git archive)
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.github' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='dist' \
    --exclude='.turbo' \
    --exclude='coverage' \
    --exclude="$TAR_NAME" \
    -czf "$TAR_NAME" .

if [ $? -ne 0 ]; then
    echo "❌ Failed to create package."
    exit 1
fi
echo "✅ Package created: $TAR_NAME"

# 2. UPLOAD VIA SCP
echo "cF4📤 Uploading package to server..."
scp -i "$KEY_PATH" "$TAR_NAME" "$EC2_USER@$EC2_HOST:/tmp/$TAR_NAME"

if [ $? -ne 0 ]; then
    echo "❌ SCP upload failed."
    rm "$TAR_NAME"
    exit 1
fi
echo "✅ Upload complete."

# 3. REMOTE EXECUTION (SSH)
echo "🔧 Executing remote commands..."
ssh -i "$KEY_PATH" "$EC2_USER@$EC2_HOST" << EOF
    # Stop on any error
    set -e

    echo "📂 creating remote directory if needed..."
    sudo mkdir -p $REMOTE_DIR
    sudo chown -R $EC2_USER:$EC2_USER $REMOTE_DIR

    echo "📦 Extracting package..."
    tar -xzf /tmp/$TAR_NAME -C $REMOTE_DIR
    rm /tmp/$TAR_NAME

    cd $REMOTE_DIR

    echo "📦 Installing dependencies..."
    npm install

    echo "🏗️ Building application..."
    npm run build

    echo "🔄 Restarting PM2 processes..."
    # Check if ecosystem file exists, otherwise start generic
    if [ -f "ecosystem.config.js" ]; then
        pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
    else
        pm2 restart all || echo "⚠️ No PM2 processes to restart"
    fi
    pm2 save

    echo "🌐 Reloading Nginx..."
    sudo nginx -t && sudo systemctl reload nginx

    echo "✨ Remote deployment finished!"
EOF

# CLEANUP
echo "🧹 Cleaning up local package..."
rm "$TAR_NAME"

echo "✅✅ DEPLOYMENT SUCCESSFUL! ✅✅"
