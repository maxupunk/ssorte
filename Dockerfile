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
# RUN yarn global add pm2

# Definir o diretório de trabalho
WORKDIR /app

# Copiar a aplicação construída da etapa de build
COPY --from=build /app/.output ./

# Expor a porta da aplicação
EXPOSE 3000

# Iniciar a aplicação usando PM2
CMD ["node", "server/index.mjs"]