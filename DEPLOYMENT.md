# VPS Deployment Guide - Risk Return Analysis

This guide will help you deploy the Risk Return Analysis application on your Hostinger VPS at http://82.25.105.18/risk-return

## Deployment Configuration

- **Frontend URL**: http://82.25.105.18/risk-return
- **Backend Port**: 5002 (will not conflict with other projects)
- **Frontend Build**: Served via Nginx
- **Backend**: Python Flask with PM2 process manager

## Quick Deployment

1. **SSH into your VPS**:
   ```bash
   ssh root@82.25.105.18
   ```

2. **Download and run the deployment script**:
   ```bash
   wget https://raw.githubusercontent.com/Manideepgadi1/Risk-Return/main/deploy.sh
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Access your application**:
   Open http://82.25.105.18/risk-return in your browser

## What the Deployment Script Does

1. ✅ Checks and installs system requirements (Node.js, Python, Nginx, PM2)
2. ✅ Clones/updates the repository from GitHub
3. ✅ Sets up Python virtual environment and installs backend dependencies
4. ✅ Installs frontend dependencies and builds the React app
5. ✅ Configures backend to run on port 5002 (avoiding conflicts)
6. ✅ Sets up PM2 to manage the backend process
7. ✅ Configures Nginx to serve frontend and proxy API requests
8. ✅ Enables automatic restart on server reboot

## Port Configuration

The application uses these ports to avoid conflicts:
- **Backend**: Port 5002 (instead of default 5000)
- **Frontend**: Served via Nginx on port 80 at /risk-return path

## Manual Deployment Steps (Alternative)

If you prefer to deploy manually:

### 1. Install Dependencies
```bash
# Update system
sudo apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
sudo apt-get install -y python3 python3-pip python3-venv

# Install Nginx
sudo apt-get install -y nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Clone Repository
```bash
cd /var/www
git clone https://github.com/Manideepgadi1/Risk-Return.git risk-return
cd risk-return
```

### 3. Setup Backend
```bash
cd /var/www/risk-return/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
deactivate
```

### 4. Setup Frontend
```bash
cd /var/www/risk-return/frontend

# Install dependencies
npm install

# Build production version
npm run build
```

### 5. Start Backend with PM2
```bash
cd /var/www/risk-return/backend
pm2 start "source venv/bin/activate && python3 app.py" --name risk-return-backend --interpreter bash
pm2 save
pm2 startup
```

### 6. Configure Nginx
Create `/etc/nginx/sites-available/risk-return`:
```nginx
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
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/risk-return /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Managing the Application

### View Backend Logs
```bash
pm2 logs risk-return-backend
```

### Restart Backend
```bash
pm2 restart risk-return-backend
```

### Stop Backend
```bash
pm2 stop risk-return-backend
```

### Check Status
```bash
pm2 status
```

### Update Application
```bash
cd /var/www/risk-return
git pull origin main

# Rebuild frontend
cd frontend
npm install
npm run build

# Restart backend
pm2 restart risk-return-backend

# Reload nginx
sudo systemctl reload nginx
```

## Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs risk-return-backend

# Check if port 5002 is available
sudo netstat -tlnp | grep 5002

# Restart manually
cd /var/www/risk-return/backend
source venv/bin/activate
python3 app.py
```

### Frontend not loading
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### API requests failing
1. Check if backend is running: `pm2 status`
2. Check backend logs: `pm2 logs risk-return-backend`
3. Test API directly: `curl http://localhost:5002/api/health`
4. Check Nginx proxy configuration

## Security Recommendations

1. **Firewall Configuration**:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **SSL Certificate** (Optional but recommended):
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Environment Variables**:
   Create `.env` file in backend directory for sensitive data:
   ```bash
   FLASK_ENV=production
   SECRET_KEY=your-secret-key-here
   ```

## Performance Optimization

1. **Enable Gzip in Nginx**:
   Add to Nginx configuration:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **PM2 Cluster Mode** (for high traffic):
   ```bash
   pm2 start app.py --name risk-return-backend -i 2
   ```

## Checking Existing Projects

Before deployment, verify which ports are in use:
```bash
# Check all listening ports
sudo netstat -tlnp | grep LISTEN

# Check PM2 processes
pm2 list

# Check Nginx sites
ls -la /etc/nginx/sites-enabled/
```

## Support

If you encounter any issues:
1. Check logs: `pm2 logs risk-return-backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify ports: `sudo netstat -tlnp`
4. Restart services: `pm2 restart all && sudo systemctl restart nginx`
