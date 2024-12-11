# Usando a imagem do Node.js
FROM node:18

# Definindo o diretório de trabalho dentro do container
WORKDIR /app

# Copiando os arquivos do backend para o container
COPY . .

# Instalando as dependências
RUN npm install --legacy-peer-deps

# Expondo a porta da API (ajuste conforme necessário)
EXPOSE 4000

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]