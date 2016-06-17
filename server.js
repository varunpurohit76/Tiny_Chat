var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	var username = '';
	socket.on('user',function(user){
		username = user;
		socket.broadcast.emit('new user',user);
	});
	socket.on('chat message', function(msg){
		io.emit('chat message', msg,username);
	});
	socket.on('disconnect',function(){
		socket.broadcast.emit('user left',username);
	});
});

var port = Number(process.env.PORT || 3000)
http.listen(port, function(){
  console.log('listening on *: ' + port);
});
