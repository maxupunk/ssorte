# Etapa de build
FROM node:22.10.0-alpine AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências
COPY package*.json ./
COPY ecosystem.config.cjs ./

# Instalar as dependências
RUN yarn install

# Copiar o código da aplicação
COPY . .

# Construir a aplicação
RUN npx prisma generate && yarn build

# Etapa de produção
FROM node:22.10.0-alpine

# Instalar PM2 globalmente
RUN yarn global add pm2

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o código da aplicação
COPY --from=build ./app/package*.json ./
COPY --from=build ./app/node_modules ./node_modules
COPY --from=build ./app/prisma ./prisma
COPY --from=build ./app/.env ./

# Copiar a aplicação construída da etapa de build
COPY --from=build /app/.output ./

# Expor a porta da aplicação
EXPOSE 3000

# Iniciar a aplicação usando PM2
CMD ["pm2-runtime", "server/index.mjs"]