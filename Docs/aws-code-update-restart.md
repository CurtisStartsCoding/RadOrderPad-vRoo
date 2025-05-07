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