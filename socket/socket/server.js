var app = require('express')();  
var http = require('http').Server(app);  
var  fs=  require('fs'); 
//var ProtoBuf = require("protobufjs"); 
//var User = require('./userproto.js')['protobuf']['User'];
//----------------httpServer设置-------------------------------
app.get('/', function(req, res){ 
        fs.readFile('./OptPb.html', function(err,  data)  {  
            if  (err)  {    
              res.send('文件不存在');  
            }else{    
              res.send(data.toString());  
            }  
        }); 
});
app.get('/js/socket.io.js',function(req,res){ 
        fs.readFile('./js/socket.io.js', function(err,  data)  {  
            if  (err)  {  
              res.send('文件不存在');  
            }else{  
              //console.log(data.toString());  
              res.send(data.toString()); 
            }  
        });  
}); 
app.get('/jspb/long.min.js',function(req,res){ 
        fs.readFile('./jspb/long.min.js', function(err,  data)  {  
            if  (err)  {  
              res.send('文件不存在');  
            }else{  
              //console.log(data.toString());  
              res.send(data.toString()); 
            }  
        });  
}); 
app.get('/jspb/ByteBuffer.min.js',function(req,res){ 
        fs.readFile('./jspb/ByteBuffer.min.js', function(err,  data)  {  
            if  (err)  {  
              res.send('文件不存在');  
            }else{  
              //console.log(data.toString());  
              res.send(data.toString()); 
            }  
        });  
}); 
app.get('/jspb/ProtoBuf.min.js',function(req,res){ 
        fs.readFile('./jspb/ProtoBuf.min.js', function(err,  data)  {  
            if  (err)  {  
              res.send('文件不存在');  
            }else{  
              //console.log(data.toString());  
              res.send(data.toString()); 
            }  
        });  
}); 
app.get('/pb.proto',function(req,res){ 
        fs.readFile('./pb.proto', function(err,  data)  {  
            if  (err)  {  
              res.send('文件不存在');  
            }else{    
              res.send(data.toString()); 
            }  
        });  
}); 

http.listen(9000, function(){  
    console.log('listening on *:9000');  
}); 

