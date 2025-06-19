# AWS Code Update and Restart Procedure
# Run this script from your home directory (~)

# If you're already in ~/code directory, adjust paths accordingly:
# - Remove ~/code/ prefix from paths
# - Use ./RadOrderPad-vRoo instead of ~/code/RadOrderPad-vRoo

BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
mkdir -p ~/code/backups
cp -r ~/code/RadOrderPad-vRoo ~/code/RadOrderPad-vRoo-backup-$BACKUP_DATE
echo "Backup created at: ~/code/RadOrderPad-vRoo-backup-$BACKUP_DATE"
cd ~/code/RadOrderPad-vRoo
git fetch --all
git pull origin backend-v1.0-release
npm install
npm run build

# Only prune AFTER build succeeds
if [ $? -eq 0 ]; then
      npm prune --production
      pm2 stop RadOrderPad
      pm2 delete RadOrderPad
      pm2 start dist/index.js --name RadOrderPad --update-env
      pm2 logs RadOrderPad --lines 50
  else
      echo "Build failed, not deploying"
  fi
pm2 logs RadOrderPad --lines 100




BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
  mkdir -p ~/code/backups
  cp -r ~/code/RadOrderPad-vRoo ~/code/RadOrderPad-vRoo-backup-$BACKUP_DATE
  echo "Backup created at: ~/code/RadOrderPad-vRoo-backup-$BACKUP_DATE"

  # Update and restart application
  cd ~/code/RadOrderPad-vRoo
  git fetch --all
  git reset --hard origin/backend-v1.0-release  # Changed from pull to reset --hard
  npm install
  npm run build
  # REMOVED: npm prune --production (this causes the 51 errors)
  pm2 restart RadOrderPad  # Just restart, don't delete
  pm2 logs RadOrderPad --lines 50






## old way
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
pm2 logs RadOrderPad --lines 50


npx eslint src/
npx tsc --noEmit
npm run build

git push --force-with-lease origin backend-v1.0-release