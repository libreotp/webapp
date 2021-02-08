FROM node:12.20.1-alpine3.12@sha256:42998ae4420998ff3255fc2d6884e882bd32f06d45b057f4b042e33bf48a1240 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.18.0-alpine@sha256:7ae8e5c3080f6012f8dc719e2308e60e015fcfa281c3b12bf95614bd8b6911d6
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
