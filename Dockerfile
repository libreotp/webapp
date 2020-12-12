FROM node:12.20.0-alpine3.12@sha256:14acf99d0233dc5a8cec28c036a9634febf9993240a44a9bfbb45305afa37807 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.18.0-alpine@sha256:ddcf5d8753a062e297e4448ec332e833f2688a9de667b2a723370a3bc7eb01d5
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
