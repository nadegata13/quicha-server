
module.exports = (io, socket, Quizes ) => {
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

    socket.on("leaveChatRoom", () => {
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