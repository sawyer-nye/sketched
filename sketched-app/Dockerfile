# Stage 1
FROM node:16 as node
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build --prod

# Stage 2
FROM nginx:alpine
COPY --from=node /app/dist/sketched-app /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 9100
