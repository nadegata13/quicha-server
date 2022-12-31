module.exports = (io, socket, User) => {
    socket.on("queryAccountInfo", (uid)=> {
         User.findOne({userID : uid}, function(error, result) {
            if(error) {
                console.log(error)
            } else {
                const _icon = result.icon;
                const _nickname = result.nickname;
                socket.emit("passAccountInfo", {
                    icon: _icon,
                    nickname: _nickname
                });

                console.log(uid);
                console.log(result);
                console.log("success passAccountInfo");
            }
        });
    });

}