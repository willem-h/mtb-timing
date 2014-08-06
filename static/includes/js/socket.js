var socket = io();

function socketNewRider (data) {
    socket.emit("newRider", data);
    socket.on("newRider", function(err){
        console.log(err);
        return err;
    });
}

socket.on('message', function(data){
    console.log(data);
});
