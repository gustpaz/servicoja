# Deployment Guide for ServiçoJá

This guide will walk you through the process of deploying the ServiçoJá application on a VPS (Virtual Private Server).

## Prerequisites

- A VPS running Ubuntu 20.04 or later
- SSH access to your VPS
- A domain name pointing to your VPS IP address
- Node.js 14.x or later
- MongoDB 4.4 or later
- PM2 (for process management)
- Nginx (for reverse proxy)

## Step 1: Update the system

```bash
sudo apt update && sudo apt upgrade -y
