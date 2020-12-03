FROM node:14

RUN git clone https://github.com/jungin500/remote-heartbeat-server server &&\
    cd server && npm install && npm install -g pm2

EXPOSE 8080
ENTRYPOINT pm2-runtime server/index.js