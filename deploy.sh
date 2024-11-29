#!/bin/bash

# Exit on error
set -e

# Update repository
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build

# Restart the application
pm2 restart servicoja

echo "Deployment completed successfully!"

