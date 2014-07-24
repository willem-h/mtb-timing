var express = require('express.io');
var app = express();
app.http().io();
app.use(express.static(__dirname + '/static'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mtb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("everything is happy!");
});

app.io.route('ready', function(socket){
    console.log(socket);
});

app.listen(80);
