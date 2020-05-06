rm -rf node_modules/
git fetch -p
git pull
npm ci
CANON_CONST_BASE='https://api.datamexico.org/tesseract/data' npm run build
pm2 kill
pm2 restart ecosystem.config.js --update-env
pm2 save
