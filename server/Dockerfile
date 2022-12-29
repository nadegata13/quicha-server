FROM node:alpine

# ワーキングディレクトリを作成
WORKDIR /usr/src/app

# アプリケーションの依存関係をインストールする
COPY package*.json ./
RUN npm install

# アプリケーションのソースをバンドルする
COPY . .

# アプリケーションを起動
CMD [ "node", "index.js" ]
