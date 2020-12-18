FROM node:12.20.0-alpine3.12@sha256:fa3b6a9051003554574f7e5bdab6495f431436b4b384a9ddcf4d33107bb99992 as build
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
