var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var user_nos = 0;
var people_online = [];

app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	var user;

	socket.on('disconnect', function(msg, username) {
		user_nos--;
		var r = people_online.indexOf(user);
		people_online.splice(r,1);
		socket.broadcast.emit('user left', user, user_nos, people_online);
	})
	
	socket.on('user connected', function(username) {
		user_nos++;
		people_online.push(username)
		io.emit('user connected', username, user_nos, people_online);	
		user = username;
	})

	socket.on('chat message', function(msg ,username){
		io.emit('chat message', msg, username);
	});
});

var port = Number(process.env.PORT || 3000)
http.listen(port, function(){
  console.log('listening on *: ' + port);
});