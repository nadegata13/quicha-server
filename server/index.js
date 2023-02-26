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
     * 新規ユーザースキーマ
     */
    const userSchema = new mongoose.Schema({
      userID: String,
      nickname: String,
      icon: Number,
      iconUrl: String,
    }, {
      collection: 'users'  // コレクション名
    });

    const User = mongoose.model('user', userSchema);

    /**
     * 管理用ユーザースキーマ
     */

    const userForMngSchema = new mongoose.Schema({
      userID: String,
      createAt: String,
      terminalID: String,
      roomHistory: [{
        roomID: String,
        enterAt: String
      }],
    }, {
      collection: "userForManagement"
    });
    const UserForMng = mongoose.model('userForMng', userForMngSchema);

    /**
     * 通知用スキーマ
     */
    const notificationSchema = new mongoose.Schema({
      userID: String,
      lifeCount: Number,
      lifeUpdate: String,
      messageForUser: [
        {
        messageID: mongoose.Schema.Types.ObjectId,
        message: String
      }
      ]
    },{
      collection: "notification"
    });
    const Notification = mongoose.model("notification", notificationSchema);

    /**
     * BAN用スキーマ
     */
    const bannedUserSchema = new mongoose.Schema({
      userID: String,
      terminalID: String,
      violationHistory: [
        {
          violationDate: String,
          violationMessage: String
        }
      ],
      unbanDate: String
    },{
      collection: "bannedUser"
    });
    const BannedUser = mongoose.model('bannedUser', bannedUserSchema);
    /**
     * クイズ用スキーマ
     */
    const quizSchema = new mongoose.Schema({
      quizID: String,
      quizItems: [
        {
          item: String,
          type: Number,
        }
      ],
      answer: String,
      hint: String,
      category: String,
      quizCount: Number,
      correctCount: Number,
      difficulty: Number,
      createUserID: String
    }, {
      collection: "quizes"
    });
    const Quizes = mongoose.model('quizes', quizSchema);


/**
 * socket接続
 */
io.on('connection', (socket) => {


  console.log("connected!");


  /**
   * マッチング中のイベントハンドラー
   */
  require("./matchingHandler.js")(io, socket, User);


  /**
   * 新規アカウントをデータベース上に保存
   * 4つのコレクションに保存
   */
  require("./createAccountHandler.js")(io,socket,User, UserForMng, Notification, BannedUser);

  /**
   * ホーム画面に対するイベントハンドラ
   */
  require("./homeHandler.js")(io, socket, User, Notification);

  /**
   * チャットルーム画面に対するイベントハンドラ
   */
  require("./chatRoomHandler.js")(io,socket,Quizes, Notification);

});







// 3000番ポートでHTTPサーバーを起動
server.listen(PORT,"0.0.0.0", () => {
  console.log(`listening on port ${PORT}`);
});

