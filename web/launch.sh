sudo docker build -t appleseed:latest .
sudo docker run -d -p 80:3000 --name appleseed_test appleseed