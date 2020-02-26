sudo docker stop appleseed

sudo docker cp ./public appleseed:/app/
sudo docker cp copy_files.js appleseed:/app/
sudo docker cp .env appleseed:/app/
sudo docker cp server.js appleseed:/app/
sudo docker cp package.json appleseed:/app/
sudo docker cp package-lock.json appleseed:/app/
sudo docker cp nodemon.json appleseed:/app/

sudo docker start appleseed