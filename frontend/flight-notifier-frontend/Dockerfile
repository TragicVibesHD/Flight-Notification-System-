# Stage 1: Build the Angular app
FROM node:22-alpine AS build
WORKDIR /app

# Trust the corporate network's certificate during the build
COPY zscaler-root.pem ./zscaler-root.pem
ENV NODE_EXTRA_CA_CERTS=/app/zscaler-root.pem

COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/flight-notifier-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80