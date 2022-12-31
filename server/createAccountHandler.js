module.exports = (io, socket, User, UserForMng, Notification, BannedUser) => {


    socket.on("createNewAccount", ({ newUserID, newNickname, newIcon, deviceID }) => {

        var resultCode = -1;



        User.findOne({ userID: newUserID }, function (err, result) {
            if (result) {
                resultCode = 300;
                socket.emit("resultRegisterAccount", resultCode);
            } else {

                //重複アカウントがなかったら

                //ユーザー情報
                const userInfo = User({
                    userID: newUserID,
                    nickname: newNickname,
                    icon: newIcon,
                    iconUrl: "http://localhost:8080/anonymous.png"
                });
                //管理用ユーザー情報
                const userForMngInfo = UserForMng({
                    userID: newUserID,
                    createAt: getDate(),
                    roomHisotry: [],
                });

                //通知用
                const notificationInstance = Notification({
                    userID: newUserID,
                    lifeCount: 5,
                    lifeUpdate: dateToString(new Date(2000,1)),
                    messageForUser: []
                });


                //BAN用
                const bannedUserInstance = BannedUser({
                    userID: newUserID,
                    terminalID: deviceID,
                    violationHistory: [],
                    unbanDate: dateToString(new Date(2000,1))
                });

                //ユーザー情報を保存
                userInfo.save(function (err) {
                    if (err) {
                        resultCode = 200;
                        console.log("ユーザーを登録できませんでした。");
                        socket.emit("resultRegisterAccount", resultCode);
                    } else {

                        //管理用ユーザー情報を保存
                        userForMngInfo.save(function (err) {
                            //通知用
                            notificationInstance.save(function (err) {
                                //BAN用
                                //同一デバイスIDが存在しているか
                                BannedUser.findOne({ terminalID: deviceID }, function (error, result) {
                                    if (result) {

                                        resultCode = 100;
                                        console.log("ユーザーを作成しました！" + newUserID + newNickname + newIcon);
                                        socket.emit("resultRegisterAccount", resultCode);

                                    } else {
                                        bannedUserInstance.save(function (err) {

                                            resultCode = 100;
                                            console.log("ユーザーを作成しました！" + newUserID + newNickname + newIcon);
                                            socket.emit("resultRegisterAccount", resultCode);
                                        });
                                    }
                                });
                            });
                        });

                    }


                });
            }
        });
    });

    function getDate() {
        let now = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString();
        let date = now.getDate().toString();
        let hours = now.getHours().toString();
        let minutes = now.getMinutes().toString();
        let seconds = now.getSeconds().toString();

        return year + "/" + month + "/" + date + "-" + hours
            + ":" + minutes + ":" + seconds;
    }
    function dateToString(_date) {
        let time = new Date(_date.getTime() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

        let year = time.getFullYear().toString();
        let month = (time.getMonth() + 1).toString();
        let date = time.getDate().toString();
        let hours = time.getHours().toString();
        let minutes = time.getMinutes().toString();
        let seconds = time.getSeconds().toString();

        return year + "/" + month + "/" + date + "-" + hours
            + ":" + minutes + ":" + seconds;
    }
}