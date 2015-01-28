var port = Number(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);       // Openshift OR Heroku OR Local
var ip = process.env.OPENSHIFT_NODEJS_IP;

// Setup requires
var express = require('express');
var server;
var io;
var app;
var mysql = require('mysql');

app = express();

if (process.env.OPENSHIFT_NODEJS_IP) {
    var db = mysql.createConnection({
        host: process.env.OPENSHIFT_MYSQL_DB_HOST,
        user: "adminXA7JWLe",
        password: "VUxBgqAVh3Ry",
        database: "mtb"
    });
} else {
    var db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "ServerSQL",
        database: "mtb_node"
    });
}

// Connect to mysql database ready for use
db.connect();

// Make Express be server
app.use(express.static(__dirname + '/static'));
server = require('http').createServer(app);
server.listen(port, ip, function(){
    console.log("Listening on http://%s:%s", ip, port);
});

io = require('socket.io').listen(server);

function activeList (data) {
    // console.log("Current riders requested");

    var searchQuery = "SELECT riders.number, riders.name, categories.name AS category, laps.start_time AS starttime FROM laps JOIN riders ON laps.rider_id=riders.rider_id JOIN categories ON riders.category_id=categories.category_id WHERE end_time=0 ORDER BY laps.lap_id ASC";
    db.query(searchQuery, function(err, rows){
        if (err) {
            throw err;
        } else {
            io.emit('activeList', rows);
        }
    });
}

io.on('connection', function(socket){
    console.log("A user has connected");

    function tracklist () {
        var searchQuery = "SELECT track_id AS id, name, length FROM tracks";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('trackList', rows);
                // return rows;
            }
        });
    }

    socket.on('search', function(query){
        query = Number(query);

        var searchQuery = "SELECT riders.rider_id AS id, riders.name, riders.number, categories.name AS category FROM riders INNER JOIN categories ON riders.category_id=categories.category_id WHERE riders.number='"+ db.escape(query) +"'";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else if (rows[0]) {
                socket.emit('search', rows[0]);
            } else {
                socket.emit('search', false);
            }
        });
    });

    socket.on('newTrack', function(track){
        if (!isNaN(track.length)) {
            db.query('INSERT INTO tracks SET ?', track, function(err, result){
                if (err) throw err;
            });
            socket.emit('newTrack', {bool:true, name:track.name});
            socket.emit('tracklist');
        } else {
            socket.emit('newTrack', false);
            console.log('New track failed: '+ track.name);
        }
    });

    socket.on('trackList', function(){
        socket.emit('trackList', tracklist());
    });

    socket.on('newCategory', function(category){
        if (!isNaN(category.track_id)) {
            db.query('INSERT INTO categories SET ?', category, function(err, result){
                if (err) throw err;
            });
            socket.emit('newCategory', {bool:true, name:category.name});
        } else {
            socket.emit('newCategory', false);
        }
    });

    socket.on('newRider', function(rider){
        if (!isNaN(rider.rider_id)) {
            console.log(JSON.stringify(rider));
            db.query('INSERT INTO riders SET ?', rider, function(err, result){
                if (err) throw err;
            });
            socket.emit('newRider', {bool:true, name:rider.name});
        } else {
            socket.emit('newRider', false);
        }
    });

    socket.on('categoryList', function(){
        var searchQuery = "SELECT categories.category_id, categories.name, categories.parameters FROM categories";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('categoryList', rows);
            }
        });
    });

    socket.on('riderList', function(){
        var searchQuery = "SELECT riders.rider_id, riders.name, riders.number, categories.name AS category_name FROM riders INNER JOIN categories ON riders.category_id=categories.category_id";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('riderList', rows);
            }
        });
    });

    socket.on('recentList', function () {
        var searchQuery = "SELECT riders.number, riders.name, categories.name AS category, laps.start_time AS starttime, laps.end_time AS endtime FROM laps JOIN riders ON laps.rider_id=riders.rider_id JOIN categories ON riders.category_id=categories.category_id WHERE laps.end_time>0 ORDER BY laps.end_time DESC";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('recentList', rows);
            }
        });
    });

    socket.on('overallList', function () {
        var searchQuery = "SELECT DISTINCT riders.number, riders.name, categories.name AS category, MIN(laps.end_time-laps.start_time) AS time, laps.start_time AS starttime, laps.end_time AS endtime FROM laps JOIN riders ON laps.rider_id=riders.rider_id JOIN categories ON riders.category_id=categories.category_id WHERE end_time>0 GROUP BY laps.rider_id ORDER BY time ASC";
        // var searchQuery = "SELECT DISTINCT riders.number, riders.name, categories.name AS category, laps.start_time AS starttime, laps.end_time AS endtime FROM laps JOIN riders ON laps.rider_id=riders.rider_id JOIN categories ON riders.category_id=categories.category_id WHERE end_time>0 ORDER BY end_time-start_time ASC";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('overallList', rows);
            }
        });
    });

    socket.on('handicapList', function () {
        var searchQuery = "SELECT riders.number, riders.name, categories.name AS category, SUM(tracks.length)/SUM(laps.end_time-laps.start_time) AS avgspeed FROM laps JOIN riders ON laps.rider_id=riders.rider_id JOIN categories ON riders.category_id=categories.category_id JOIN tracks ON categories.track_id=tracks.track_id WHERE end_time>0 GROUP BY laps.rider_id ORDER BY avgspeed DESC;";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('handicapList', rows);
            }
        });
    });

    socket.on('timeRider', function (rider) {
        var searchQuery = "SELECT laps.end_time AS endtime FROM laps JOIN riders ON laps.rider_id=riders.rider_id WHERE riders.rider_id=? ORDER BY laps.lap_id DESC";
        db.query(searchQuery, rider, function(err, rows){
            if (err) {
                throw err;
            } else {
                if (rows[0] && rows[0].endtime === 0) {
                    db.query('UPDATE laps SET end_time='+ Date.now()/1000 +' WHERE rider_id='+ rider +' AND end_time=0', function (err, result) {
                        if (err) throw err;
                        socket.emit('finishedRider');
                    });
                } else {
                    console.log(Date.now() +" time");

                    data = {
                        lap_id: null,
                        rider_id: rider,
                        date: null,
                        start_time: Date.now()/1000
                    };

                    db.query('INSERT INTO laps SET ?', data, function(err, result){
                        if (err) throw err;

                        var searchQuery = "SELECT * FROM laps WHERE lap_id='"+ db.escape(result.insertId) +"'";
                        db.query(searchQuery, function(err, rows){
                            if (err) {
                                throw err;
                            } else {
                                socket.emit('startRider', rows);
                            }
                        });
                    });
                }
            }
        });
    });
});

setInterval(function(){
    activeList();
},500);

// // Close database gracefully
// db.end(function(err){
//     if (err) throw err;
// });
