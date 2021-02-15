FROM node:12.20.2-alpine3.12@sha256:361042d98d4a17bae412f140c9bd9e9bf2512206141fdae6a1384298b887c5d6 as build
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
