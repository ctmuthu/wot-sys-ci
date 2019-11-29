sleep 10
sudo rm -rf /data/db/mongod.lock
#sudo docker stop $(sudo docker ps -a -q)
#sudo docker rm $(sudo docker ps -a -q)
#sudo docker rmi -f $(sudo docker images -a -q)
#sudo docker run -d --name rpi3-mongodb3 --restart unless-stopped -v /data/db:/data/db -v /data/configdb:/data/configdb -p 27017:27017 -p 28017:28017 andresvidal/rpi3-mongodb3:latest mongod --rest
docker start rpi3-mongodb3
sleep 10
sudo node /home/pi/wot-sys-db-automation/wot-sys-ci/db/server/app.js &
