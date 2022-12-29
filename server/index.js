const express = require('express');
const http = require('http');
const dburl = 'mongodb://takashi:jugemujugemugokounosurikire3827382722153929@mongo/quicha_db?authSource=admin';
const mongoose = require('mongoose');
const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}


const app = express();
const server = http.createServer(app);

const { Socket } = require('socket.io');
const { userInfo } = require('os');

const PORT = process.env.PORT || 8080;

var io = require('socket.io')(server);

app.use(express.json());






mongoose.connect(dburl, connectOption).then(
  ()=>{
    console.log("connection successful!");
  }
).catch((e) => {
  console.log(e);
});



    /**
     * 新規ユーザースキーマー
     */
    var userSchema = new mongoose.Schema({
      userID: String,
      nickname: String,
      icon: Number,
      iconUrl: String,
    }, {
      collection: 'users'  // コレクション名
    });

    var User = mongoose.model('user', userSchema);

/**
 * socket接続
 */
io.on('connection', (socket) => {


  console.log("connected!");


  /**
   * マッチング中のイベントハンドラー
   */
  require("./matchingHandler.js")(io, socket);


  /**
   * 新規アカウントをデータベース上に保存
   */
  require("./createAccountHandler.js")(io,socket,User);

  /**
   * ホーム画面に対するイベントハンドラ
   */
  require("./homeHandler.js")(io, socket, User);

});







// 3000番ポートでHTTPサーバーを起動
server.listen(PORT,"0.0.0.0", () => {
  console.log(`listening on port ${PORT}`);
});

