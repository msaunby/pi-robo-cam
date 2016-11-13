var express = require('express');
var app = express();
app.use(express.static('static'));

var http = require('http').Server(app);
var io = require('socket.io')(http);
var Transform = require('stream').Transform,
    csv = require('csv-streamify');

var csvIn = csv({objectMode: true});

var parser = new Transform({objectMode: true});

var xyz = {x:0,y:0,z:0};

parser._transform = function(data, encoding, done) {

  xyz.x = Number(data[0]);
  xyz.y = Number(data[1]);
  xyz.z = Number(data[2]);
  done();
};


io.on('connection', function(socket){

    console.log('a user connected');
});

const spawn = require('child_process').spawn;
const accel = spawn('../accel_stream', []);

accel.stdout
.pipe(csvIn)
.pipe(parser);



var counter = 0;
// start interval timer.
var interval = setInterval( function() {
    //console.log('timer', counter);
    io.emit('xyz', xyz);
}, 250);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
