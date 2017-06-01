var fs = require("fs"); 
ProtoBuf = require("protobufjs"); 

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
    var buffer = User.encode(user).finish();
    //------------解码----------------
    var message = User.decode(buffer);

    console.log(message.uname);
});