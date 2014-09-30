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

fs.readFile('includes/maleoveralldb.txt', {encoding: 'utf-8'}, function (err, data) {
	if (err) throw err;
	maleOverall = JSON.parse(data);
});

function saveDB (rider,recent,maleOverall) {
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

	fs.writeFile('includes/maleoveralldb.txt', JSON.stringify(recent), function(err){
		if (err) {
			console.log("Error saving maleoverallDB: "+ err);
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

function overall (data) {
	console.log("Request Overall");
	var fastestLaps = [];
	var maleFastestLaps = [];
	var femaleFastestLaps = [];
	var handicaps = [];

	data.sort(function(obj2, obj1){
		return obj2.number - obj1.number;
	});

	for(var x = 0; x < data.length; x++){
		if (data[x].laps.length > 0){
			data[x].laps.sort(function(obj1, obj2){
				return (obj1.end - obj1.start) - (obj2.end - obj2.start);
			});

			fastestLaps[x] = {
				rank: x,
				number: data[x].number,
				name: data[x].name,
				category: data[x].category, 
				lap: data[x].laps[0],
				offset: 0
			}
		}
	}

	fastestLaps.sort(function(obj2, obj1){
		if (obj1.lap && obj2.lap){
			return (obj1.lap.end - obj1.lap.start) - (obj2.lap.end - obj2.lap.start);
		}
	});

	fastestLaps.reverse();

	for(var x = 0; x < fastestLaps.length; x++){
		fastestLaps[x].rank = x + 1;
	}

	io.sockets.emit('overallList', fastestLaps);

	var fastestTime = fastestLaps[0].lap.end - fastestLaps[0].lap.start;
	console.log(fastestLaps[0].lap.end);
	// handicaps = fastestLaps;

	for(var x = 0; x < fastestLaps.length; x++){
		fastestLaps[x].offset = (fastestLaps[x].lap.end - fastestLaps[x].lap.start) - fastestTime;
		console.log(fastestLaps[x].offset);
	}

	io.sockets.emit('handicapList', fastestLaps);

	for(var x = 0; x < fastestLaps.length; x++){
		if (fastestLaps[x].category === "Male" || fastestLaps[x].category === "Junior Male"){
			maleFastestLaps.push(fastestLaps[x]);
		} else if (fastestLaps[x].category === "Female" || fastestLaps[x].category === "Junior Female"){
			femaleFastestLaps.push(fastestLaps[x]);
		}
	}

	for(var x = 0; x < maleFastestLaps.length; x++){
		maleFastestLaps[x].rank = x + 1;
	}

	for(var x = 0; x < femaleFastestLaps.length; x++){
		femaleFastestLaps[x].rank = x + 1;
	}

	io.sockets.emit('maleOverallList', maleFastestLaps);
	io.sockets.emit('femaleOverallList', femaleFastestLaps);
}

function maleOverallList (data) {

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

	socket.on('maleOverallList', function(){
		maleOverallList(maleOverall);
	});

	socket.on('overallList', function(){
		overall(riders);
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
				}
			}

			// Update results page
			recentList(recents);
			overall(riders);
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
		},4000);
	});

	socket.on('resultList', function(){
		resultList(riders);
	});

    socket.on('disconnect', function(){
        console.log("A user disconnected");
    });

	// Reset database without removing riders
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
