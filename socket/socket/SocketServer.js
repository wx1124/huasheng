var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var  fs=  require('fs');

app.get('/', function(req, res){
		fs.readFile('./client.html', function(err,  data)  {
            if(err)  {
			  res.send('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});
app.get('/js/jquery-1.3.1.min.js', function(req, res){
		fs.readFile('./js/jquery-1.3.1.min.js', function(err,  data)  {
            if(err)  {
			  res.send('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});
app.get('/js/socket.io.js', function(req, res){
		fs.readFile('./js/socket.io.js', function(err,  data)  {
            if(err)  {
			  res.send('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});

app.get('/jspb/long.min.js', function(req, res){
		fs.readFile('./jspb/long.min.js', function(err,  data)  {
            if(err)  {
			  res.send('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});

app.get('/jspb/ByteBuffer.min.js', function(req, res){
		fs.readFile('./jspb/ByteBuffer.min.js', function(err,  data)  {
            if(err)  {
			  res.send('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});

app.get('/jspb/ProtoBuf.min.js', function(req, res){
		fs.readFile('./jspb/ProtoBuf.min.js', function(err,  data)  {
            if(err)  {
			  res.send('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});

app.get('/pb.proto', function(req, res){
		fs.readFile('./pb.proto', function(err,  data)  {
            if(err)  {
			  res.send('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});
//----------Socket服务------------------------------
var ProtoBuf = require("protobufjs");    
var User = require('./pbproto.js')['protobuf']['User']; 

io.on('connection', function(socket){
	console.log('有人连上来了');
	//监听用户发布聊天内容
	socket.on('message', function(msg){
		console.log(msg);
		var userbuf = User.decode(msg);    
		console.log(userbuf.uname);
		userbuf.uname='李四';
		var buffer = userbuf.encode();//编码    
		var msgbuf = buffer.toBuffer();//加密  

		socket.send(msgbuf);
	});
	socket.on('disconnect', function(){
		console.log('有人离开了');
	});
})

http.listen(9000, function(){
	console.log('listening on *:9000');
});