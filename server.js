var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('user connected!');
	socket.on('disconnect', function(){
		console.log('user disconnected!');
	})
	socket.on('chat message', function(msg){
		console.log('message : ' + msg);
		io.emit('chat message', msg);
	});
});

var port = Number(process.env.PORT || 3000)
http.listen(port, function(){
  console.log('listening on *: ' + port);
});
