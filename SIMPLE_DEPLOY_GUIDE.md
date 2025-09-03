# 🚀 SIMPLE OpenHealth Deployment Guide

## One-Time Setup (5 minutes)

### 1. Create Docker Hub Account
1. Go to https://hub.docker.com
2. Sign up for free account
3. Create a repository called `openhealth`

### 2. Set up GitHub Secrets
In your GitHub repository (https://github.com/kryptobaseddev/open-health):
1. Go to Settings → Secrets → Actions
2. Add these secrets:
   - `DOCKER_HUB_USERNAME`: Your Docker Hub username
   - `DOCKER_HUB_TOKEN`: Your Docker Hub access token
     - Get token from: Docker Hub → Account Settings → Security → Access Tokens → New Access Token

### 3. Update docker-compose.simple.yml
1. Edit line 22: Change `yourdockerhubusername` to your actual Docker Hub username
2. Commit and push this change

## Now It's Automatic! 🎉

Every time you push to GitHub:
1. GitHub automatically builds your Docker image
2. Pushes it to Docker Hub
3. Your Portainer can pull the latest version

## Deploy in Portainer

### Method 1: Using Git Repository (Recommended)
1. In Portainer → Stacks → Add Stack
2. Name: `openhealth`
3. Build method: **Repository**
4. Repository URL: `https://github.com/kryptobaseddev/open-health`
5. Reference: `main`
6. Compose path: `docker-compose.yml`
7. Environment variables (add these in Portainer):
```
POSTGRES_PASSWORD=YourSecurePassword123
POSTGRES_USER=openhealth
POSTGRES_DB=openhealth
AUTH_SECRET=GenerateWith_openssl_rand_base64_32
ENCRYPTION_KEY=GenerateWith_openssl_rand_base64_32
NEXT_PUBLIC_URL=http://your-server-ip:3000
```
8. Deploy the stack

### Method 2: Using Web Editor
1. Copy contents from: https://raw.githubusercontent.com/kryptobaseddev/open-health/main/docker-compose.yml
2. Paste in Portainer Web Editor
3. Add same environment variables
4. Deploy

## That's It! 

Your workflow is now:
1. Make changes in your code
2. Git commit and push
3. Wait 2-3 minutes for Docker Hub build
4. In Portainer: Update stack (pulls new image automatically)

## Checking Status

### See if Docker image built:
- Check GitHub Actions: https://github.com/kryptobaseddev/open-health/actions
- Check Docker Hub: https://hub.docker.com/r/yourusername/openhealth

### In Portainer:
- Click on your stack
- Click "Update" to pull latest image
- Or enable "Pull latest image" when deploying

## Troubleshooting

**Build failing on GitHub?**
- Check GitHub Actions tab for error messages
- Usually it's the Docker Hub token that needs updating

**Portainer can't pull image?**
- Make sure Docker Hub repository is public
- Or add Docker Hub credentials in Portainer → Registries

**App won't start?**
- Check environment variables in Portainer
- Look at container logs in Portainer

---

## The Simple Truth

Now you have:
- ✅ Automatic Docker builds when you push code
- ✅ Images stored on Docker Hub
- ✅ Simple docker-compose that Portainer understands
- ✅ No manual building needed ever again!

Just code → commit → push → update stack in Portainer. Done! 🎉