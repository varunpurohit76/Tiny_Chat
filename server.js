var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.on('disconnect', function(){
	})
	socket.on('chat message', function(msg,user){
		io.emit('chat message', msg,user);
	});
});

var port = Number(process.env.PORT || 3000)
http.listen(port, function(){
  console.log('listening on *: ' + port);
});
