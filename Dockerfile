FROM node:12.20.1-alpine3.12@sha256:42998ae4420998ff3255fc2d6884e882bd32f06d45b057f4b042e33bf48a1240 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.18.0-alpine@sha256:da3716611fb965f3fda1f3281882baeb2760ca8bb7317f1d22ed45e75570827b
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
