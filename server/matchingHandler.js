    //ルーム作成時の時間(ミリ秒)
    var timeStamp = new Date().getTime();
    //ルーム作成時の補助的な番号
    var roomNumber = 0;

module.exports = (io, socket) => {



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
            io.to(Array.from(socket.rooms)).emit('matchingUser', 'aiueo');
            console.log(Array.from(socket.rooms)[1]);
            console.log("entryRoby");

            //次のルーム名を変える
            timeStamp = new Date().getTime();
            roomNumber++;
        }
    });

    /**
     * 入室するとルーム内のメンバーに通知
     */
    socket.on('getMyRoom', () => {
        console.log(socket.rooms);
        let room = Array.from(socket.rooms)[1];

        people = io.sockets.adapter.rooms.get(room).size;
        //クライアントのルームに通知
        socket.to(room).emit('successJoinRoom', people);
        console.log('getMyRoom');
    });

    /**
     * 退室
     */
    socket.on('leaveRoom', () => {
        let room = Array.from(socket.rooms)[1];
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