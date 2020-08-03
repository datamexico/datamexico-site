rm -rf node_modules/
git fetch -p
git pull
npm ci
npm run build
pm2 restart ecosystem.config.js --update-env
pm2 save
