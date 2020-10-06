FROM node:12.18.4-alpine3.12@sha256:59fa78a2149e3470ba7346fb17938e2c48e17096006083003ee1673cc172d676 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.19.3-alpine@sha256:a3c6118edc80de4a5aaf2711b7742c25d4d2da54325bae465205cb386afa79ee
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
