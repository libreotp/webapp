FROM node:12.21.0-alpine3.12@sha256:ed65b1d010ad52d59cbd045b5c976dbe6df343b87c0e4c69091fa925158bed06 as build
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
