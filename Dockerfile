FROM node:16.16.0-alpine
WORKDIR /app
COPY package.json .
COPY ./prisma prisma

ARG NODE_ENV
RUN if [ $NODE_ENV = "docker" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . ./

RUN npm run build
COPY ./.env ./build/

WORKDIR ./build
ENV PORT 5000
EXPOSE $PORT

CMD ["node", "server.js"]