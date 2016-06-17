var socket = io();
      var username = prompt('Username','User');
      socket.on('connect', function() {        
        socket.emit('user connected', username);
        $('form').submit(function(){
          socket.emit('chat message', $('#m').val(), username);
          $('#m').val('');
          return false;
        });
      });
      socket.on('chat message', function(msg, username){
        console.log(msg);
        $('#messages').append($('<li>').text(username + ' : ' + msg));
      }); 

      socket.on('user left', function(username, user_nos) {
        $('#messages').append($('<li class=\'delete\'>').text(username + ' left! '+user_nos + ' people online.'  ));
      })

      socket.on('user connected', function(username, user_nos) {
        $('#messages').append($('<li class=\'add\'>').text(username + ' joined! '+user_nos + ' people online.'  ));
      })