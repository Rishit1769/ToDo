# syntax=docker/dockerfile:1.7

# Build stage: compile React assets with production optimizations.
FROM node:20-alpine AS build
WORKDIR /app

# Optional build-time fallback for CRA env substitution.
ARG REACT_APP_API_BASE_URL=https://api.yourdomain.com
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage: serve static build via hardened Nginx image.
FROM nginx:1.27-alpine AS runtime

# Remove default Nginx site and use our SPA-aware server config.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built frontend assets.
COPY --from=build /app/build /usr/share/nginx/html

# Runtime env injection script writes /usr/share/nginx/html/config.js at container start.
COPY docker-entrypoint.d/40-runtime-env.sh /docker-entrypoint.d/40-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-env.sh

EXPOSE 80
