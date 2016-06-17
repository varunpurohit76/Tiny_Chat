var express = require('express');
var app = express();
var http = require('http').Server(app);
var socketioJwt = require('socketio-jwt');
var dotenv = require('dotenv');
var io = require('socket.io')(http);

dotenv.load();

var env = {
	AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
	AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
	res.render({env:env});
});

io
	.on('connection', socketioJwt.authorize({
		secret: Buffer(JSON.stringify(process.env.AUTH0_CLIENT_SECRET), 'base64'),
		timeout: 15000
	}))
	.on('authenticated',function(socket){
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
