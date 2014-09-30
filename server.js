// Setup requires
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io');
io = io(server);
var fs = require("fs");

var riders, recents, maleOverall, femaleOverall, overall;
var startList = [];

// Make Express be server
app.use(express.static(__dirname + '/static'));

fs.readFile('includes/riderdb.txt', {encoding: 'utf-8'}, function (err, data) {
	if (err) throw err;
	riders = JSON.parse(data);
});

fs.readFile('includes/recentdb.txt', {encoding: 'utf-8'}, function (err, data) {
	if (err) throw err;
	recents = JSON.parse(data);
});

function saveDB (rider,recent) {
	fs.writeFile('includes/riderdb.txt', JSON.stringify(rider), function(err){
		if (err) {
			console.log("Error saving RiderDB: "+ err);
		} else {
			// console.log('RiderDB saved successfully');
		}
	});

	fs.writeFile('includes/recentdb.txt', JSON.stringify(recent), function(err){
		if (err) {
			console.log("Error saving RecentDB: "+ err);
		} else {
			// console.log('RecentDB saved successfully');
		}
	});
}

function activeList (data) {
	// console.log("Current riders requested");
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

function resultList (data) {
	var current = [];
	var recent = [];
	data.sort(function(obj1, obj2){
		return obj1.current.start - obj2.current.start;
	});
	for (var i=0; i<data.length; i++) {
		if (data[i].current.start > 0 && data[i].current.end === 0) {
			current.push(data[i]);
		}
	}
	data.sort(function(obj1, obj2){
		return obj1.current.start - obj2.current.start;
	});

	io.sockets.emit('resultList', {current:current, recent:recent});
	current = "";
}

function recentList (data) {
	console.log("Request recent list");
	io.sockets.emit('recentList', data);
}

io.on('connection', function(socket){
	console.log("A user connected");
	socket.emit("serverState", 'ready');

	socket.on('newRider', function(data){
		riders.push(data);
		saveDB(riders,recents);
		socket.emit('newRider', data);
	});

	socket.on('search', function(query){
		query = Number(query);
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

	// socket.on('activeList', function(){
	// 	activeList(riders);
	// });

	socket.on('riderList', function(){
		console.log("Request full rider list");
		riders.sort(function(obj1, obj2){
			return obj1.number - obj2.number;
		});

		socket.emit('riderList', riders);
	});

	socket.on('recentList', function(){
		recentList(recents);
	});

	socket.on('startRider', function(query){
		distance = query[1];
		query = query[0];
		// var time = Math.floor(Date.now()/1000);
		var lookup = [];
		riders.sort(function(obj1, obj2){
			return obj1.number - obj2.number;
		});
		for (var i=0; i<riders.length; i++) {
			lookup[riders[i].number] = riders[i];
		}

		if (lookup[query].current.start === 0 && lookup[query].current.end === 0) {
			var time = Math.floor(Date.now()/1000);
			var startTime = time + 10;

			riders.sort(function(obj1, obj2){
				return obj2.current.start - obj1.current.start;
			});
			if (time - riders[0].current.start < 10) {
				startTime = riders[0].current.start + 10 + 4;
			}

			for (var i=0; i<riders.length; i++) {
				if (riders[i].number === query) {
					riders[i].current.start = startTime;
					riders[i].current.distance = distance;
				}
			}

			if (startList.length === 0) {
				socket.broadcast.emit('startRider', { rider:lookup[query], start:startTime });
				console.log("Started rider: "+ query);
			} else {
				console.log("Rider queued: "+ lookup[query].name);
			}

			startList.push({ rider:lookup[query], start:startTime });
		} else if (lookup[query].current.start > 0 && lookup[query].current.end === 0) {
			var endTime = Math.floor(Date.now()/1000);

			for (var i=0; i<riders.length; i++) {
				if (riders[i].number === query) {
					var laps = riders[i].laps;
					var lapData = {
						start: riders[i].current.start,
						end: endTime,
						distance: riders[i].current.distance,
					};
					laps.push(lapData);
					riders[i].totalTime += (endTime - riders[i].current.start);
					riders[i].totalDistance = Number(riders[i].totalDistance) + Number(riders[i].current.distance);
					console.log("Stopped rider: " + query + ". Time: " + (endTime - riders[i].current.start));
					riders[i].current = {
						start: 0,
						end: 0,
						distance: 0
					};
					recents.push(riders[i]);
					overall(riders[i]);
				}
			}

			// Update Recent on results page
			recentList(recents);
		}

		activeList(riders);
		saveDB(riders,recents);
	});

	socket.on('riderSent', function(data){
		setTimeout(function(){
			console.log("Rider sent: "+ data);
			startList.shift();
			if (startList.length > 0) {
				socket.emit('startRider', startList[0]);
				console.log("Started next rider: "+ startList[0].rider.name);
			}
		},3700);
	});

	socket.on('resultList', function(){
		resultList(riders);
	});

	// console.log(recents);

    socket.on('disconnect', function(){
        console.log("A user disconnected");
    });

	// // Reset database without removing riders
	// for (var i=0; i<riders.length; i++) {
	// 	riders[i].current.start = 0;
	// 	riders[i].current.end = 0;
	// 	riders[i].current.distance = 0;
	// 	riders[i].laps = [];
	// 	riders[i].totalTime = 0;
	// 	riders[i].totalDistance = 0;
	// }
	// saveDB(riders,recents);
});

setInterval(function(){
	activeList(riders);
},1000);

var port = Number(process.env.PORT || 5000);
server.listen(port, function(){
    console.log("Listening on "+ port);
});
