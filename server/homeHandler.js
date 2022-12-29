module.exports = (io, socket, User) => {
    socket.on("queryAccountInfo", (uid)=> {
        User.findOne({UserID : uid}, function(error, result) {
            if(error) {
                console.log(error)
            } else {
                const icon = result.icon;
                socket.emit("passAccountInfo", icon);

                console.log("success passAccountInfo");
            }
        });
    });

}