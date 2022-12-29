module.exports = (io, socket, User) => {

  
  socket.on("createNewAccount", ({ newUserID, newNickname, newIcon }) => {

    var resultCode = -1;



     User.findOne({ userID: newUserID }, function (err, result) {
      if (result) {
      resultCode = 300;
      socket.emit("resultRegisterAccount", resultCode);
      } else {

    //重複アカウントがなかったら

    const userInfo = User({
      userID: newUserID,
      nickname: newNickname,
      icon: newIcon,
      iconUrl: "http://localhost:8080/anonymous.png"
    });


    userInfo.save(function (err) {
      if (err) {
        resultCode = 200;
        console.log("ユーザーを登録できませんでした。");
      } else {
        resultCode = 100;
        console.log("ユーザーを作成しました！" + newUserID + newNickname + newIcon);
      }
    socket.emit("resultRegisterAccount", resultCode);
    });
      }
    });
  });
  }