FROM node:18.14.0-alpine
WORKDIR /app
# 複製 package.json 和 package-lock.json 到容器中
#COPY package*.json ./

# 安裝相依套件
#RUN npm install

# 複製專案檔案到容器中
#COPY . .

# 開放容器的埠號
EXPOSE 3000

# 啟動伺服器
#CMD [ "node", "server.js" ]
CMD ["tail", "-f", "/dev/null"]