# syntax=docker/dockerfile:1.7

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies for smaller and safer runtime image.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

# Drop root privileges for better container security.
RUN chown -R node:node /app
USER node

EXPOSE 5000
CMD ["node", "src/server.js"]
