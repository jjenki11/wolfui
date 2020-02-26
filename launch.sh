sudo docker build -t appleseed:latest .
sudo docker run -d -p 80:3000 -p 1337:1337 --name appleseed_test appleseed