FROM node:18-alpine AS builder

WORKDIR /app

# Primero copiamos solo los archivos de prisma
COPY prisma ./prisma/

# Luego copiamos los archivos de dependencias
COPY package*.json ./

# Ajustamos para evitar que se ejecute prisma generate antes de tener el schema
RUN npm ci --ignore-scripts

# Copiamos el resto de archivos
COPY . .

# Ahora generamos prisma explícitamente
RUN npx prisma generate

# Compilamos la aplicación
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Configuramos explícitamente el puerto
ENV PORT=3030
ENV NODE_ENV=production

EXPOSE 3030

# Healthcheck simplificado
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3030/ > /dev/null || exit 1

CMD ["npm", "start"] 