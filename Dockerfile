# syntax=docker/dockerfile:1

#############################################
# 1. BUILDER STAGE
#############################################
FROM node:18-alpine AS builder
LABEL maintainer="cabovibes"

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar solo los files necesarios para usar cache
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Construir Next.js en modo standalone
RUN pnpm run build


#############################################
# 2. RUNNER STAGE (PRODUCCIÓN)
#############################################
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Seguridad: usuario no-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

# Puerto que expone Next
EXPOSE 3000

# Ejecutar server.js (Next.js standalone)
CMD ["node", "server.js"]