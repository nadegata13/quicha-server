
module.exports = (io, socket, Quizes,Notification ) => {
    //送信メッセージ
socket.on("sendMessage", ({sendUserID, sendMessage}) => {
    io.to([...socket.rooms][1]).emit("receiveMessage",  {
        userID : sendUserID,
        receivedMessage: sendMessage
    });
});

socket.on("requestQuizes", () => {


    Quizes.aggregate([{ $sample: { size: 5 } }],null,(function(err,result){
      console.log(result);
    io.to([...socket.rooms][1]).emit("receiveQuiz", result);
    })); 
    // var fetchedQuiz = Quizes.find({}).skip(random).limit(1);


});

socket.on("correctAnswer",({quizAnswer, answerUserID}) => {
    io.to([...socket.rooms][1]).emit("receiveMessage",  {
        userID : "BOT",
        receivedMessage: "正解は、" + quizAnswer + "です！"
    });
})

socket.on("moveToNextQuiz", ()=> {

    io.to([...socket.rooms][1]).emit("startNextQuiz");
});
socket.on("showQuizAnswer", (answer)=> {

    io.to([...socket.rooms][1]).emit("receiveMessage",  {
        userID : "BOT",
        receivedMessage: "正解は、" + answer + "です！"
    });
});

socket.on("giveCorrectAnswer", () => {
                socket.broadcast.to([...socket.rooms][1]).emit("isCorrectTrue");
});

socket.on("decreaseLife", (_userID) => {

                Notification.findOne({userID : _userID}, function(error, notification){
                    if(!notification){
                    } else {

                //アイコン
                //ニックネーム
                //ライフ
                const _lifeCount = notification.lifeCount - 1; 
                //ライフ変更時間 
                const _lifeUpdate = notification.lifeUpdate;
                        var dateHandler = require("./dateHandler.js");
                const now = dateHandler.getNowDate();

        Notification.findOneAndUpdate({userID: _userID}, {lifeCount: _lifeCount, lifeUpdate : now }, function(error, result){
            if(result){
                console.log("decreasedLife");
            }
        });

                    }

                });
});

    socket.on("leaveChatRoom", () => {

    io.to([...socket.rooms][1]).emit("receiveMessage",  {
        userID : "BOT",
        receivedMessage: "1名が退室しました。"
    });
    io.to([...socket.rooms][1]).emit("leavedMember");

        console.log("抜ける前" + Array.from(socket.rooms));
        console.log("抜ける前" + [...socket.rooms][1]);
        socket.leave([...socket.rooms][1]);
        console.log("leaved room!");
        console.log("抜けた後" + Array.from(socket.rooms));
    });

socket.on("startQuiz", () => {
    io.to([...socket.rooms][1]).emit("startQuiz");
});

}