FROM node:12.21.0-alpine3.12@sha256:52ebeae882181b4cb1b51593ce5d6264a721e88b32746082c9e21841c7267e33 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.18.0-alpine@sha256:34039e81cf9de5f7f92f6280701e92cd51b85fb6b7170c41f6bf8920fcc79f8e
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
