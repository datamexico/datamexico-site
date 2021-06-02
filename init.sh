if [ -z "$1" ]
then
   echo "ERROR: branch argument is missing: Run 'bash init.sh develop'"
else
  rm -rf node_modules/
  git checkout $1
  git fetch -p
  git pull
  npm ci
  npm run build
  pm2 restart ecosystem.config.js --update-env
  pm2 save
fi
