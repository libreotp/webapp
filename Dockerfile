FROM node:12.20.0-alpine3.12@sha256:a70163c2ace5233dcd4018dcd74bd13400a7de5c5dd7465edb6c0fa0a47a3f96 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.18.0-alpine@sha256:662a0c5a8677063c27b0ddd42f1c801be643b9502f7b1a4e2e727cb2bc3808a8
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
