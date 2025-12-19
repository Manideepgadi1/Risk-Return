# 🚀 VPS Deployment Instructions

## ✅ Code Successfully Pushed to GitHub
Repository: https://github.com/Manideepgadi1/Risk-Return

## 📋 Deployment Summary

Your Risk Return Analysis app will be deployed at:
**http://82.25.105.18/risk-return**

### Configuration:
- ✅ Backend runs on port **5002** (won't conflict with other projects)
- ✅ Frontend served via Nginx at **/risk-return** path
- ✅ PM2 manages backend process with auto-restart
- ✅ Existing projects will NOT be disturbed

---

## 🎯 Simple Deployment (Recommended)

SSH into your VPS and run this single command:

```bash
ssh root@82.25.105.18
curl -s https://raw.githubusercontent.com/Manideepgadi1/Risk-Return/main/deploy.sh | bash
```

That's it! The script will automatically:
1. Install all required dependencies (Node.js, Python, Nginx, PM2)
2. Clone the repository
3. Setup backend and frontend
4. Configure Nginx
5. Start the application

---

## 📝 Step-by-Step Deployment (Alternative)

If you prefer to see each step:

### Step 1: SSH into VPS
```bash
ssh root@82.25.105.18
```

### Step 2: Download deployment script
```bash
cd ~
wget https://raw.githubusercontent.com/Manideepgadi1/Risk-Return/main/deploy.sh
chmod +x deploy.sh
```

### Step 3: Run deployment
```bash
./deploy.sh
```

### Step 4: Verify deployment
```bash
# Check backend is running
pm2 status

# Check Nginx configuration
sudo nginx -t

# Test API
curl http://localhost:5002/api/health
```

### Step 5: Access application
Open in browser: **http://82.25.105.18/risk-return**

---

## 🔍 Pre-Deployment Checks (Optional)

Before deploying, you can verify which ports are in use:

```bash
# Check all listening ports
sudo netstat -tlnp | grep LISTEN

# Check PM2 processes
pm2 list

# Check Nginx sites
ls -la /etc/nginx/sites-enabled/
```

---

## 🔧 Managing Your Application

### View Logs
```bash
pm2 logs risk-return-backend
```

### Restart Application
```bash
pm2 restart risk-return-backend
```

### Update Application (After pushing changes to GitHub)
```bash
cd /var/www/risk-return
git pull origin main
cd frontend
npm run build
pm2 restart risk-return-backend
sudo systemctl reload nginx
```

### Stop Application
```bash
pm2 stop risk-return-backend
```

### Remove Application (if needed)
```bash
pm2 delete risk-return-backend
sudo rm /etc/nginx/sites-enabled/risk-return
sudo systemctl reload nginx
sudo rm -rf /var/www/risk-return
```

---

## 🛡️ Safety Features

The deployment script is designed to be safe:

1. ✅ **No port conflicts**: Uses port 5002 instead of common ports
2. ✅ **Separate path**: Frontend at /risk-return won't interfere with root site
3. ✅ **Isolated process**: PM2 manages backend separately from other apps
4. ✅ **Nginx configuration**: Adds new site without modifying existing ones
5. ✅ **No data loss**: Only adds new files, doesn't modify existing projects

---

## 📊 What Gets Installed

### Directory Structure
```
/var/www/risk-return/
├── backend/
│   ├── app.py (Flask backend on port 5002)
│   ├── requirements.txt
│   └── venv/ (Python virtual environment)
├── frontend/
│   ├── build/ (Production React build)
│   ├── src/
│   └── package.json
├── deploy.sh
└── DEPLOYMENT.md
```

### Nginx Configuration
New file: `/etc/nginx/sites-available/risk-return`
- Serves frontend at http://82.25.105.18/risk-return
- Proxies API requests to backend on port 5002

### PM2 Process
- Process name: `risk-return-backend`
- Auto-restart on failure
- Starts on server reboot

---

## ❓ Troubleshooting

### Backend not starting
```bash
pm2 logs risk-return-backend
cd /var/www/risk-return/backend
source venv/bin/activate
python3 app.py
```

### Frontend showing 404
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### API requests failing
```bash
# Test backend directly
curl http://localhost:5002/api/indices

# Check backend logs
pm2 logs risk-return-backend

# Restart backend
pm2 restart risk-return-backend
```

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs risk-return-backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify ports: `sudo netstat -tlnp | grep 5002`
4. Test API: `curl http://localhost:5002/api/health`

---

## ✨ Success Indicators

After deployment, you should see:

1. **PM2 Status**: `risk-return-backend` showing as "online"
   ```bash
   pm2 status
   ```

2. **Nginx Test**: No errors
   ```bash
   sudo nginx -t
   ```

3. **API Response**: JSON data returned
   ```bash
   curl http://localhost:5002/api/health
   ```

4. **Browser Access**: Dashboard loads at http://82.25.105.18/risk-return

---

## 🎉 You're Done!

Once deployed, share the link with your team:
**http://82.25.105.18/risk-return**

The application will:
- ✅ Show 126 market indices
- ✅ Display risk-return scatter plot with category colors
- ✅ Provide interactive hover tooltips
- ✅ Show quadrant analysis
- ✅ Filter by category and risk
- ✅ Display top performers

Enjoy your Risk Return Analysis Dashboard! 🚀
