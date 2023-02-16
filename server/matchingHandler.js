    //ルーム作成時の時間(ミリ秒)
    var timeStamp = new Date().getTime();
    //ルーム作成時の補助的な番号
    var roomNumber = 0;

module.exports = (io, socket, User) => {



    /**
     * ロビー入室
     */
    socket.on('entryRoby', ({ userID }) => {

        //接続人数
        socket.emit('getClientCount', socket.client.conn.server.clientsCount.toString());

        //新規ルーム名

        var room = "room" + timeStamp + "-" + roomNumber;
        //入室
        socket.join(room);
        //入室人数
        people = io.sockets.adapter.rooms.get(room).size;
        console.log(room + "に" + String(people) + "人入室");

        if (Number(people) >= 2) {
            //リーダー役を与える。
            socket.emit("assignLeader");

            io.to([...socket.rooms][1]).emit('matchingUser', 'aiueo');
            console.log(Array.from(socket.rooms)[1]);
            console.log("entryRoby");

            //次のルーム名を変える
            timeStamp = new Date().getTime();
            roomNumber++;
        }
    });

    /**
     * マッチング時に相手に自分のプロフィールを送る
     */
    socket.on("sendUserProfile",( myUserID ) => {
        User.findOne({userID : myUserID}, function(err, result){
            console.log("sendUserProfile");
            console.log(myUserID);
            if(result){
                const _icon = result.icon;
                const _nickname = result.nickname;

                socket.broadcast.to([...socket.rooms][1]).emit("receiveUserProfile", {
                    userID: myUserID,
                    icon: _icon,
                    nickname: _nickname
                });
            }

        });
    });

    /**
     * 入室するとルーム内のメンバーに通知
     */
    socket.on('getMyRoom', () => {
        console.log(socket.rooms);
        let room = [...socket.rooms][1];

        people = io.sockets.adapter.rooms.get(room).size;
        //クライアントのルームに通知
        socket.to(room).emit('successJoinRoom', people);
        console.log('getMyRoom');
    });

    /**
     * 退室
     */
    socket.on('leaveRoom', () => {
        let room = [...socket.rooms][1];
        socket.leave(room);
        console.log('leave');
    });

    /**
     * テスト(なんの？)
     */
    socket.on('test', () => {

        console.log(getDate());
        socket.emit('testDate', getDate());

        3

        console.log("テストと表示");

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


}