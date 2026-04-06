# Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build Backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc

# Production Image
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=backend-builder /app/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000
CMD ["node", "dist/server.js"]
