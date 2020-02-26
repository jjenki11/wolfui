FROM ubuntu:18.04

RUN apt-get update && apt-get install -y python3 python3-pip
RUN apt-get install -y npm

WORKDIR /app
COPY . /app/src

RUN cd /app/src/web && npm install
RUN cd /app/src && pip3 install -r requirements.txt

CMD cd /app/src/web && npm start & cd /app/src && python3 server.py