module.exports = (io, socket, User, Notification) => {

    var dateHandler = require("./dateHandler.js");

    socket.on("queryAccountInfo", (uid)=> {
        //ユーザー
         User.findOne({userID : uid}, function(error, result) {
            if(!result) {
            } else {

                //通知用

                Notification.findOne({userID : uid}, function(error, notification){
                    if(!notification){
                    } else {

                //アイコン
                const _icon = result.icon;
                //ニックネーム
                const _nickname = result.nickname;
                //ライフ
                const _lifeCount = notification.lifeCount; 
                //ライフ変更時間 
                const _lifeUpdate = notification.lifeUpdate;


                socket.emit("passAccountInfo", {
                    icon: _icon,
                    nickname: _nickname,
                    lifeCount: _lifeCount,
                    lifeUpdate: _lifeUpdate
                });
                    }

                });


            }
        });
    });

    socket.on('updateLifeCount', ({_userID, _lifeCount}) => {
        //現在時刻
        const now = dateHandler.getNowDate();
        Notification.findOneAndUpdate({userID: _userID}, {lifeCount: _lifeCount, lifeUpdate : now }, function(error, result){
            if(result){
                console.log("successUpdateLifeCount");
                socket.emit('successUpdateLife', {
                    lifeCount: _lifeCount,
                    lifeUpdate: now
                });
            }
        });
    });

    socket.on("testHome" ,() => {
        socket.emit("testEvent");
    });

}