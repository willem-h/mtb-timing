var mysql = require('mysql');
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "W_hreck"
});

// Connect to mysql and set 'mountain' as active database so we can connect later
db.connect();
db.query("use mountain");

// var strQuery = "select * from riders";
// db.query(strQuery, function(err, rows){                              +-------------------------------------------+
//     if (err) {                                                       |  Just to check if everything is working   |
//         throw err;                                                   +-------------------------------------------+
//     } else {
//         console.log("We succeeded: "+ rows);
//     }
// });


//  +-------------------------------------------+
//             CONSTRUCTOR FUNCTIONS
//            For new database entries
//  +-------------------------------------------+
function Rider (name, number, category) {
    rider_id: null,
    name: name,
    number: number,
    category: category
}

function Track (name, length) {
    track_id: null,
    name: name,
    length: length
}

function Lap (rider_id, category_id, track_id, date, start_time, end_time) {
    lap_id: null,
    rider_id: rider_id,
    category_id: category_id,
    track_id: track_id,
    date: date,
    start_time: start_time,
    end_time: end_time
}

function Category (name, parameters) {
    category_id: null,
    name: name,
    parameters: parameters
}
//      End constructor functions     //

// var query = db.query('INSERT INTO riders SET ?', rider, function(err, result){
//     if (err) throw err;
// });
// console.log(query.sql);

// Close database gracefully
db.end(function(err){
    if (err) throw err;
});

ALTER TABLE categories ADD track_id INT AFTER name;
