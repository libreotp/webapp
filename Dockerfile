FROM node:12.22.1-alpine3.12@sha256:83233f79a40109329a5c29e4aa42013ddb65c649388f42ff1f889b68849d8de6 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.20.0-alpine@sha256:55684c622b7b62045bd4578e402704bdd1923f6ab704f57134e712c2f1da48c8
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
