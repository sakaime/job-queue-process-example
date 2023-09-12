FROM keymetrics/pm2:18-buster

WORKDIR /usr/app
COPY src src/
COPY package.json .
COPY pm2.json .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --omit=dev

RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.json" ]