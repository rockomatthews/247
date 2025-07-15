# 🚀 SUPER SIMPLE STREAMING SETUP

## Step 1: Log into your Digital Ocean droplet

```bash
ssh root@YOUR_DROPLET_IP
```

## Step 2: Run this ONE command

```bash
curl -s https://raw.githubusercontent.com/alfg/docker-nginx-rtmp/master/install.sh | bash
```

**That's it!** 

The command will:
- Install Docker automatically
- Start your streaming server
- Give you all the URLs you need

## Step 3: Configure OBS

1. Open OBS Studio
2. Go to Settings → Stream  
3. Service: **Custom**
4. Server: `rtmp://YOUR_DROPLET_IP:1935/live`
5. Stream Key: `stream`

## Step 4: Update your website

Add this to your Vercel environment variables:

```
NEXT_PUBLIC_STREAM_URL=http://YOUR_DROPLET_IP/hls/stream.m3u8
```

## Test it

1. Start streaming in OBS
2. Go to `http://YOUR_DROPLET_IP/stat` to see if it's working
3. Your website should show the stream after 30 seconds

## If something breaks

Restart everything:
```bash
docker restart streaming-server
```

---

**That's literally it. No files to upload, no complex scripts - just one command!**