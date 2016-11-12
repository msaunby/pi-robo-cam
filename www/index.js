var express = require('express');
var app = express();
app.use(express.static('static'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){

    console.log('a user connected');
});

const spawn = require('child_process').spawn;
const accel = spawn('ls', ['-l', '/bin']);

accel.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});
    


var counter = 0;
// start interval timer.
var interval = setInterval( function() {
    //console.log('timer', counter);
    io.emit('timer', { for: 'everyone', count: counter });
    counter++;
    if (counter >= 20000) {
	clearInterval(interval);
	console.log('ending counter');
    }
}, 100);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
