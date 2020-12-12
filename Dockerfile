FROM node:12.20.0-alpine3.12@sha256:a3cc3a7f3dbf8c7d30c89e1fa76fad14137b411671c146f990a0d3cc1c294acb as build
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
