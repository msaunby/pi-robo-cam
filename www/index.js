var express = require('express');
var app = express();
app.use(express.static('static'));

var http = require('http').Server(app);
var io = require('socket.io')(http);
var Transform = require('stream').Transform,
    csv = require('csv-streamify');

var csvIn = csv({objectMode: true});

var parser = new Transform({objectMode: true});

parser._transform = function(data, encoding, done) {
  //this.push("row " + data[0] + ":" + data[1] + "\n");
  io.emit('xyz', { x:data[0], y:data[1], z:data[2] });
  done();
};


io.on('connection', function(socket){

    console.log('a user connected');
});

const spawn = require('child_process').spawn;
const accel = spawn('../accel_stream', []);

//accel.stdout.on('data', (data) => {
//    console.log(`stdout: ${data}`);
//});
    
accel.stdout
.pipe(csvIn)
.pipe(parser);
//.pipe(process.stdout);



var counter = 0;
// start interval timer.
var interval = setInterval( function() {
    //console.log('timer', counter);
    //io.emit('timer', { for: 'everyone', count: counter });
    counter++;
    if (counter >= 20000) {
	clearInterval(interval);
	console.log('ending counter');
    }
}, 100);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
