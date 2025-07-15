# 🚀 MAKE IT WORK - Complete Step-by-Step Guide

## Step 1: Create DigitalOcean Server (5 minutes)

### 1.1 Sign up for DigitalOcean
- Go to https://digitalocean.com
- Sign up with GitHub or email
- Add payment method (will charge ~$5/month)

### 1.2 Create Droplet
1. Click **"Create"** → **"Droplets"**
2. **Image**: Ubuntu 22.04 (LTS) x64
3. **Size**: Basic $5/month (1GB RAM, 1 vCPU)
4. **Authentication**: Password (create a strong password)
5. **Hostname**: `streaming-server`
6. Click **"Create Droplet"**

### 1.3 Get Your Server IP
- After 2 minutes, you'll see your droplet
- **COPY THE IP ADDRESS** (looks like 143.198.123.45)
- This is your `YOUR_SERVER_IP`

## Step 2: Setup RTMP Server (10 minutes)

### 2.1 Connect to Server
1. Open Terminal (Mac) or Command Prompt (Windows)
2. Run: `ssh root@YOUR_SERVER_IP` (replace with your actual IP)
3. Type `yes` when prompted
4. Enter the password you created

### 2.2 Upload and Run Setup Script
```bash
# Download setup files
wget https://raw.githubusercontent.com/your-username/obs-streaming-site/main/setup-streaming-server.sh
wget https://raw.githubusercontent.com/your-username/obs-streaming-site/main/nginx-complete.conf

# Make executable and run
chmod +x setup-streaming-server.sh
sudo ./setup-streaming-server.sh
```

**OR if you have the files locally:**
```bash
# On your local machine, upload files:
scp setup-streaming-server.sh nginx-complete.conf root@YOUR_SERVER_IP:~/

# Then SSH and run:
ssh root@YOUR_SERVER_IP
sudo ./setup-streaming-server.sh
```

### 2.3 Save Your URLs
After setup completes, you'll see:
- **RTMP URL**: `rtmp://YOUR_SERVER_IP:1935/live`
- **HLS URL**: `http://YOUR_SERVER_IP/hls/test.m3u8`
- **Web Interface**: `http://YOUR_SERVER_IP`

**WRITE THESE DOWN!**

## Step 3: Deploy WebSocket Server (5 minutes)

### 3.1 Sign up for Railway
- Go to https://railway.app
- Sign up with GitHub
- Connect your GitHub account

### 3.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `obs-streaming-site` repository
4. It will automatically detect and deploy

### 3.3 Add Environment Variable
1. Go to your Railway project dashboard
2. Click **"Variables"** tab
3. Add: 
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-vercel-app.vercel.app` (your Vercel URL)

### 3.4 Get WebSocket URL
- In Railway dashboard, click **"Settings"**
- Copy the **"Public Domain"** (looks like: `https://obs-streaming-site-production.up.railway.app`)
- This is your WebSocket URL

## Step 4: Configure Vercel Environment (3 minutes)

### 4.1 Go to Vercel Dashboard
- Go to https://vercel.com/dashboard
- Click on your `obs-streaming-site` project

### 4.2 Add Environment Variables
1. Click **"Settings"** tab
2. Click **"Environment Variables"**
3. Add these variables:

**Variable 1:**
- **Name**: `NEXT_PUBLIC_STREAM_URL`
- **Value**: `http://YOUR_SERVER_IP/hls/test.m3u8` (use your actual IP)

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SOCKET_URL`
- **Value**: `wss://your-railway-app.up.railway.app` (use your Railway URL, change `https` to `wss`)

4. Click **"Save"**

### 4.3 Redeploy
1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

## Step 5: Configure OBS Studio (2 minutes)

### 5.1 Open OBS Studio
1. Go to **Settings** → **Stream**
2. **Service**: Custom...
3. **Server**: `rtmp://YOUR_SERVER_IP:1935/live` (your actual IP)
4. **Stream Key**: `test`
5. Click **"OK"**

### 5.2 Test Stream
1. Add a source (Display Capture, Camera, etc.)
2. Click **"Start Streaming"**
3. Wait 10-30 seconds

## Step 6: Test Everything (2 minutes)

### 6.1 Check Your Website
1. Go to your Vercel URL: `https://your-app.vercel.app`
2. You should see:
   - Cover image initially
   - Video switches to your stream when OBS starts
   - Comments section below video

### 6.2 Check Stream Status
1. Go to: `http://YOUR_SERVER_IP/stat`
2. Should show your active stream

### 6.3 Test Comments
1. Open your website in 2 browser tabs
2. Enter name and comment in one tab
3. Should appear in both tabs instantly

## 🎉 YOU'RE LIVE!

**Your URLs:**
- **Website**: `https://your-app.vercel.app`
- **RTMP Server**: `rtmp://YOUR_SERVER_IP:1935/live`
- **Stream Key**: `test`
- **Admin Panel**: `http://YOUR_SERVER_IP/stat`

## 🆘 Troubleshooting

### Stream Not Showing
1. Check OBS is connected: Green square in bottom right
2. Wait 30 seconds for HLS to generate
3. Check server status: `http://YOUR_SERVER_IP/stat`

### Comments Not Working
1. Check Railway deployment is running
2. Verify WebSocket URL starts with `wss://` not `https://`
3. Check browser console for errors

### Website Shows Error
1. Check Vercel environment variables are saved
2. Redeploy after adding variables
3. Verify URLs don't have extra spaces

## 💰 Monthly Cost
- **DigitalOcean**: $5
- **Vercel**: Free
- **Railway**: Free
- **Total**: $5/month

## 🔥 Pro Tips
1. **Bookmark** `http://YOUR_SERVER_IP/stat` to monitor streams
2. **Save** your RTMP settings in OBS
3. **Test** before going live by streaming for a few minutes
4. **Monitor** server usage in DigitalOcean dashboard

**You now have a professional 24/7 streaming platform!** 🎬✨