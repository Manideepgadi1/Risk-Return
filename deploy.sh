#!/bin/bash

# Risk Return Analysis Deployment Script for VPS
# This script safely deploys the application without disturbing existing projects

echo "=========================================="
echo "Risk Return Analysis - VPS Deployment"
echo "=========================================="

# Configuration
APP_DIR="/var/www/risk-return"
BACKEND_PORT=5002
FRONTEND_PORT=3002
DOMAIN="82.25.105.18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Checking system requirements...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Installing...${NC}"
    sudo apt-get update
    sudo apt-get install -y git
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python3 is not installed. Installing...${NC}"
    sudo apt-get install -y python3 python3-pip python3-venv
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Installing...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Nginx is not installed. Installing...${NC}"
    sudo apt-get install -y nginx
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 is not installed. Installing globally...${NC}"
    sudo npm install -g pm2
fi

echo -e "${GREEN}✓ System requirements checked${NC}"

echo -e "${YELLOW}Step 2: Cloning/Updating repository...${NC}"

# Create app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    echo "Creating application directory..."
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
    
    # Clone the repository
    git clone https://github.com/Manideepgadi1/Risk-Return.git $APP_DIR
else
    echo "Application directory exists. Pulling latest changes..."
    cd $APP_DIR
    git pull origin main
fi

cd $APP_DIR
echo -e "${GREEN}✓ Repository updated${NC}"

echo -e "${YELLOW}Step 3: Setting up Python backend...${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "$APP_DIR/backend/venv" ]; then
    python3 -m venv $APP_DIR/backend/venv
fi

# Activate virtual environment and install dependencies
source $APP_DIR/backend/venv/bin/activate
pip install -r $APP_DIR/backend/requirements.txt
deactivate

echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo -e "${YELLOW}Step 4: Setting up React frontend...${NC}"

cd $APP_DIR/frontend

# Install frontend dependencies
npm install

# Build the React app
npm run build

echo -e "${GREEN}✓ Frontend built successfully${NC}"

echo -e "${YELLOW}Step 5: Configuring backend to run on port $BACKEND_PORT...${NC}"

# Update backend port in app.py if needed
cd $APP_DIR/backend

# Create a production runner script
cat > run_backend.sh << EOL
#!/bin/bash
cd $APP_DIR/backend
source venv/bin/activate
export FLASK_ENV=production
python3 app.py
EOL

chmod +x run_backend.sh

echo -e "${GREEN}✓ Backend configuration complete${NC}"

echo -e "${YELLOW}Step 6: Setting up PM2 processes...${NC}"

# Stop existing processes if they exist
pm2 delete risk-return-backend 2>/dev/null || true

# Start backend with PM2
cd $APP_DIR/backend
pm2 start run_backend.sh --name risk-return-backend --interpreter bash

# Save PM2 configuration
pm2 save
pm2 startup | tail -n 1 | sudo bash

echo -e "${GREEN}✓ PM2 processes configured${NC}"

echo -e "${YELLOW}Step 7: Configuring Nginx...${NC}"

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/risk-return << 'EOL'
server {
    listen 80;
    server_name 82.25.105.18;

    # Serve frontend at /risk-return
    location /risk-return {
        alias /var/www/risk-return/frontend/build;
        try_files $uri $uri/ /risk-return/index.html;
        index index.html;
    }

    # Proxy API requests to backend
    location /risk-return/api/ {
        rewrite ^/risk-return/api/(.*) /api/$1 break;
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOL

# Enable the site if not already enabled
if [ ! -L /etc/nginx/sites-enabled/risk-return ]; then
    sudo ln -s /etc/nginx/sites-available/risk-return /etc/nginx/sites-enabled/
fi

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

echo -e "${GREEN}✓ Nginx configured${NC}"

echo -e "${YELLOW}Step 8: Verifying deployment...${NC}"

# Check if backend is running
sleep 3
if pm2 list | grep -q "risk-return-backend"; then
    echo -e "${GREEN}✓ Backend is running on port $BACKEND_PORT${NC}"
else
    echo -e "${RED}✗ Backend failed to start${NC}"
fi

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${RED}✗ Nginx is not running${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Your application is now available at:"
echo -e "${GREEN}http://82.25.105.18/risk-return${NC}"
echo ""
echo "Useful commands:"
echo "  pm2 list                    - List all PM2 processes"
echo "  pm2 logs risk-return-backend - View backend logs"
echo "  pm2 restart risk-return-backend - Restart backend"
echo "  sudo systemctl status nginx - Check Nginx status"
echo ""
