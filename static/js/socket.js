var socket = io();

function socketNewRider (data) {
    var stuff;
    socket.emit("newRider", data);
    socket.on("newRider", function(err){
        console.log(err);
        stuff = err;
    });
    return stuff;
}

// function socketSearch (data) {
//     // console.log(socket.emit('search', data));
//     socket.emit('search', data);
//     // var result = null;
//     // socket.on('searchRet', function(result){
//     //     if (result) {
//     //         // result = result[0];
//     //         console.log(result);
//     //         $('#searchNum').text(result.number);
//     //         $('#searchName').text(result.name);
//     //         $('#searchCat').text(result.category);
//     //     }
//     //     result = null;
//     // });
// }

socket.on("serverState", function(data){
    console.log("Server is "+ data);
});
