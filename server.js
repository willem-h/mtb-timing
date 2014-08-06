// Setup requires
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io');
io = io(server);
// var fs = require("fs");

// Make Express be server
app.use(express.static(__dirname + '/static'));

io.on('connection', function(socket){
	console.log("A user connected");

	socket.emit('message', 'Server is working');

    socket.on('disconnect', function(){
        console.log("A user disconnected");
    });
});

// fs.readFile('/etc/hostname', function (err, data) {
//   if (err) throw err;
//   console.log(data);
// });

var port = Number(process.env.PORT || 5000);
server.listen(port, function(){
    console.log("Listening on "+ port);
});
