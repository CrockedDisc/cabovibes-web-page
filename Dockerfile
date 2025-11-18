# syntax=docker/dockerfile:1

#############################################
# 1. BUILDER STAGE
#############################################
FROM node:18-alpine AS builder
LABEL maintainer="cabovibes"

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar solo los archivos necesarios para cache
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias sin dev cache
RUN pnpm install --frozen-lockfile

# Copiar todo el código
COPY . .

# Build Next.js con standalone
RUN pnpm run build


#############################################
# 2. RUNNER STAGE
#############################################
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar el standalone generado
COPY --from=builder /app/.next/standalone ./

# Copiar archivos estáticos y públicos
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# (Opcional pero recomendado) Copiar package.json para debugging en producción
COPY package.json ./

# Crear usuario no root
RUN addgroup -g 1001 -S appgroup \
    && adduser -u 1001 -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser

# Exponer el puerto Next.js
EXPOSE 3000

# Comando para correr el server de Next standalone
CMD ["node", "server.js"]