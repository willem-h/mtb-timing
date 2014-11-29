var port = Number(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000);       // Openshift OR Heroku OR Local
var ip = process.env.OPENSHIFT_NODEJS_IP || "192.168.1.3";

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
        password: "W_hreck",
        database: "mtb_node"
    });
}

// Connect to mysql database ready for use
db.connect();

// Make Express be server
app.use(express.static(__dirname + '/static'));
server = require('http').createServer(app);
server.listen(port, ip);

io = require('socket.io').listen(server);
io.on('connection', function(socket){
    console.log("A user has connected");

    socket.on('search', function(query){
        var query = Number(query);

        var searchQuery = "SELECT riders.rider_id AS number, riders.name, categories.name AS category FROM riders INNER JOIN categories ON riders.category_id=categories.category_id WHERE riders.rider_id='"+ db.escape(query) +"'";
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
        } else {
            socket.emit('newTrack', false);
        }
    });

    socket.on('trackList', function(){
        var searchQuery = "SELECT name, length FROM tracks";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('trackList', rows);
            }
        });
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

    socket.on('categoryList', function(){
        var searchQuery = "SELECT categories.name, categories.details,   FROM tracks";
        db.query(searchQuery, function(err, rows){
            if (err) {
                throw err;
            } else {
                socket.emit('trackList', rows);
            }
        });
    });
});

// // Close database gracefully
// db.end(function(err){
//     if (err) throw err;
// });
