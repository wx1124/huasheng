var ProtoBuf = require("protobufjs");    
var User = require('./pbproto.js')['protobuf']['User'];    
var user = new User({    
        'uid': 101,    
        'uname': '扎根是',    
        'pwd':'haha'    
    });    
var buffer = user.encode();//编码    
console.log('buffer='+buffer);
var msgbuf = buffer.toBuffer();//加密    
console.log('msgbuf='+msgbuf);    
    
//--------解码---------------------    
var userbuf = User.decode(msgbuf);    
console.log(userbuf.uname);                