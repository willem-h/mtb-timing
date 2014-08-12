// Setup requires
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io');
io = io(server);
var fs = require("fs");

var riders;
var startList = [];

// Make Express be server
app.use(express.static(__dirname + '/static'));

fs.readFile('includes/riderdb.txt', {encoding: 'utf-8'}, function (err, data) {
	if (err) throw err;
	riders = JSON.parse(data);
});

function saveDB (data) {
	fs.writeFile('includes/riderdb.txt', JSON.stringify(data), function(err){
		if (err) {
			console.log("Error saving DB: "+ err);
		} else {
			// console.log('RiderDB saved successfully');
		}
	});
}

function activeList (data) {
	var result = [];
	data.sort(function(obj1, obj2){
		return obj1.current.start - obj2.current.start;
	});
	for (var i=0; i<data.length; i++) {
		if (data[i].current.start > 0 && data[i].current.end === 0) {
			result.push(data[i]);
		}
	}

	io.sockets.emit('activeList', result);
	result = "";
}

setInterval(function(){
	activeList(riders);
	io.sockets.emit('time');
},1000);

io.on('connection', function(socket){
	console.log("A user connected");
	socket.emit("serverState", 'ready');

	socket.on('newRider', function(data){
		riders.push(data);
		saveDB(riders);
		socket.emit('newRider', data);
	});

	socket.on('search', function(query){
		query = Number(query);
		// console.log("Rider search");
		var lookup = [];
		riders.sort(function(obj1, obj2){
			return obj2.number - obj1.number;
		});
		for (var i=0; i<riders.length; i++) {
			lookup[riders[i].number] = riders[i];
		}

		var result = lookup[query];
		socket.emit('search', result);
		result = "";
		lookup = "";
	});

	socket.on('activeList', function(){
		activeList(riders);
	});

	socket.on('riderList', function(){
		console.log("Request full rider list");
		riders.sort(function(obj1, obj2){
			return obj1.number - obj2.number;
		});

		socket.emit('riderList', riders);
	});

	socket.on('startRider', function(query){
		var time = Math.floor(Date.now()/1000);
		var startTime = time + 5 + 4;
		var lookup = [];
		riders.sort(function(obj1, obj2){
			return obj1.number - obj2.number;
		});
		for (var i=0; i<riders.length; i++) {
			lookup[riders[i].number] = riders[i];
		}

		riders.sort(function(obj1, obj2){
			return obj2.current.start - obj1.current.start;
		});
		if (time - riders[0].current.start < 5) {
			startTime = riders[0].current.start + 5 + 4;
		}

		for (var i=0; i<riders.length; i++) {
			if (riders[i].number === query) {
				riders[i].current.start = startTime;
			}
		}

		if (startList.length === 0) {
			socket.broadcast.emit('startRider', { rider:lookup[query], start:startTime });
			console.log("Started rider: "+ query);
		} else {
			console.log("Rider queued: "+ lookup[query].name);
		}

		startList.push({ rider:lookup[query], start:startTime });
		activeList(riders);
		saveDB(riders);
	});

	socket.on('riderSent', function(data){
		setTimeout(function(){
			console.log("Rider sent: "+ data);
			// console.log(startList);
			startList.shift();
			if (startList.length > 0) {
				socket.emit('startRider', startList[0]);
				console.log("Started next rider: "+ startList[0].rider.name);
			}
		},3700);
	});

    socket.on('disconnect', function(){
        console.log("A user disconnected");
    });
});

var port = Number(process.env.PORT || 5000);
server.listen(port, function(){
    console.log("Listening on "+ port);
});
