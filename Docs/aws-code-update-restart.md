# AWS Code Update and Restart Procedure
# Run this script from your home directory (~)

# If you're already in ~/code directory, adjust paths accordingly:
# - Remove ~/code/ prefix from paths
# - Use ./RadOrderPad-vRoo instead of ~/code/RadOrderPad-vRoo

# Create backup of current code
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
mkdir -p ~/code/backups
cp -r ~/code/RadOrderPad-vRoo ~/code/RadOrderPad-vRoo-backup-$BACKUP_DATE
echo "Backup created at: ~/code/RadOrderPad-vRoo-backup-$BACKUP_DATE"

# Update and restart application
cd ~/code/RadOrderPad-vRoo
git fetch --all
git pull --ff-only origin backend-v1.0-release
npm install
npm run build
npm prune --production
pm2 stop RadOrderPad
pm2 delete RadOrderPad
pm2 start dist/index.js --name RadOrderPad --update-env
pm2 logs RadOrderPad --lines 20