FROM node:16-alpine AS builder

WORKDIR /app
COPY package.json .
COPY ./prisma prisma

COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
COPY ./.env ./build/

FROM node:16-alpine AS final
WORKDIR /app
COPY ./prisma prisma
COPY ./nginx nginx
COPY --from=builder ./app/build ./build
COPY package.json .
# RUN npm install --omit=dev

# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "docker" ]; \
#     then npm install -g nodemon && \
#     npm install -g ts-node-dev; \
#     fi

RUN npm install dotenv