var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var  fs=  require('fs');

app.get('/', function(req, res){
		fs.readFile('./expressClient.html', function(err,  data)  {
            if(err)  {
			  recall('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});
app.get('/js/jquery-1.3.1.min.js', function(req, res){
		fs.readFile('./js/jquery-1.3.1.min.js', function(err,  data)  {
            if(err)  {
			  recall('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});
app.get('/js/socket.io.js', function(req, res){
		fs.readFile('./js/socket.io.js', function(err,  data)  {
            if(err)  {
			  recall('文件不存在');
            }else{
			  res.send(data.toString());
            }
        });
});

//----------Socket服务------------------------------
var ii=0;
io.on('connection', function(socket){
	console.log('有人连上来了');
	socket.ii=++ii;
	//监听新用户加入
	socket.on('login', function(obj){
		console.log(obj);
	});
	socket.on('disconnect', function(){
		console.log(socket.ii+'离开了');
	});
	//监听用户发布聊天内容
	socket.on('message', function(obj){
		console.log(obj);
		socket.send(ii+'说:'+obj);
	});
})
//--------------------------------------------------

http.listen(9000, function(){
	console.log('listening on *:9000');
});