// Setup requires
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io');
io = io(server);
var fs = require("fs");

var riders;

// Make Express be server
app.use(express.static(__dirname + '/static'));

fs.readFile('includes/riderdb.txt', {encoding: 'utf-8'}, function (err, data) {
	if (err) throw err;
	riders = JSON.parse(data);
});

// function lookup () {
// 	var lookup = [];
// 	riders.sort(function(obj1, obj2){
// 		return obj2.number - obj1.number;
// 	});
// 	for (var i=0; i<riders.length; i++) {
// 		lookup[riders[i].number] = riders[i];
// 	}
// 	return lookup;
// }

io.on('connection', function(socket){
	console.log("A user connected");
	socket.emit("serverState", 'ready');

	socket.on('newRider', function(data){
		riders.push(data);
		fs.writeFile('includes/riderdb.txt', JSON.stringify(riders), function(err){
			if (err) {
				console.log(err);
			} else {
				console.log('RiderDB saved successfully');
			}
		});
		console.log(riders);
		socket.emit('newRider', data);
	});

	socket.on('search', function(query){
		query = Number(query);
		console.log("Rider search");
		var lookup = [];
		riders.sort(function(obj1, obj2){
			return obj2.number - obj1.number;
		});
		for (var i=0; i<riders.length; i++) {
			lookup[riders[i].number] = riders[i];
		}

		var result = lookup[query];
		socket.emit('searchRet', result);
		result = "";
		lookup = "";
	});

	socket.on('riderList', function(){
		console.log("Request active rider list");
		var result = [];
		riders.sort(function(obj1, obj2){
			return obj2.number - obj1.number;
		});
		for (var i=0; i<riders.length; i++) {
			if (riders[i].current.start > 0 && riders[i].current.end === 0) {
				result.push(riders[i]);
			}
		}

		socket.emit('riderList', result);
		result = "";
	});

	socket.on('startRider', function(query){
		var lookup = [];
		riders.sort(function(obj1, obj2){
			return obj2.number - obj1.number;
		});
		for (var i=0; i<riders.length; i++) {
			lookup[riders[i].number] = riders[i];
		}
		socket.broadcast.emit('startRider', lookup[query]);
	});

    socket.on('disconnect', function(){
        console.log("A user disconnected");
    });
});

var port = Number(process.env.PORT || 5000);
server.listen(port, function(){
    console.log("Listening on "+ port);
});
