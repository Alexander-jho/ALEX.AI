# =========================================================
# STAGE 1: Build the client assets and bundle Express backend
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the frontend and compile the server to dist/server.cjs
RUN npm run build

# =========================================================
# STAGE 2: Lightweight production running instance
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests & production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from stage 1 (compiled server and client pages)
COPY --from=builder /app/dist ./dist

# Expose the standard backend ingress port
EXPOSE 3000

# Run the compiled commonJS bundled server
CMD ["node", "dist/server.cjs"]
