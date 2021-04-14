sshpass -p ${passDelD} ssh -o StrictHostKeyChecking=no ${userDelD}@${ipDelD} << EOF

echo "1. pull code from bitbucket......"
cd ${pathDelD}
# sudo su delivx-react-website
# rm -rf 
# git clone -b parthDev https://prtvora@bitbucket.org/rsharma87/delivx-react-website.git
# cd delivx-react-website
git checkout --force parthDev
git reset --hard
git clean -fd
git pull

echo "2. Installing Dependency......"
sudo npm install

echo "3. setting up env variables...."
# export PORT=8001
# export NODE_ENV='production'

echo "4. running build......."
npm run build 

echo "5. Restart node server......"
# sudo npm install forever -g 
sudo forever stop delivXDevWebServer.js
sudo forever start delivXDevWebServer.js 
echo '----------------------------------Done!----------------------------------'

EOF