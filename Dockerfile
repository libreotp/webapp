FROM node:12.20.0-alpine3.12@sha256:14acf99d0233dc5a8cec28c036a9634febf9993240a44a9bfbb45305afa37807 as build
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
