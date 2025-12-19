#!/bin/bash

# Quick Deploy Script - Run this on your VPS
# Usage: bash quick-deploy.sh

echo "=========================================="
echo "Risk Return Analysis - Quick Deploy"
echo "=========================================="

# Download and execute the main deployment script
curl -o deploy.sh https://raw.githubusercontent.com/Manideepgadi1/Risk-Return/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
