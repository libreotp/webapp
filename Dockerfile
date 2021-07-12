FROM node:12.22.3-alpine3.12@sha256:1f31f979a02075fe5297040f38decf1a1482fae52a9722add846ff1d5ff5da65 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.20.1-alpine@sha256:ff543a82e183fe60aaae01f648ac2c8be7513f878982050a6ae37c3f0306a0d1
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
