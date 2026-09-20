# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

# --- Stage 2: Runtime ---
FROM node:20-alpine

WORKDIR /app


# Non-root user for security
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only what is needed from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./

RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

# USER nextjs

# Ensure production environment
ENV NODE_ENV=production

EXPOSE 3011

# Run start app
CMD ["npm", "start"]
