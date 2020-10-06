FROM node:14.13.0-alpine3.12@sha256:5c5e9e044a887025e23187ce9e063d27577ccd486022f8f022defaecf4db38e6 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.18.0-alpine@sha256:29dc24ed982665eb88598e0129e4ec88c2049fafc63125a4a640dd67529dc6d4
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
