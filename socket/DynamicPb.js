var fs = require("fs"); 
ProtoBuf = require("protobufjs"); //前端使用

ProtoBuf.load('./pb.proto',function(err,root){
    if(err){
        console.log(err);
        return;
    }
    User = root.lookup('protobuf.User'); 
    user = User.create({});
    /*
    for(var key in user){
        console.log(key);
    }
    */
    user.uid=111; 
    user.uname='123456'; 
    user.pwd='aabbcc'; 
    //------------编码---------------- 
    var buffer = User.encode(user).finish();//编译成二进制
    //------------解码----------------
    var message = User.decode(buffer);//解析成对象

    console.log(message.uname);
});