var fs = require('fs');//对文件的操作
module.exports={
	readfile:function(path,res){                 //异步执行
		fs.readFile(path,function(err, data){//读取路径
		if(err){			//参数
			//res.write(err);  //function是回调，就是异步
			res.write('500');
		}else{
			//res.write(data.toString());//将文件输入到前台
			res.end(data.toString());
		}
	 });
		//console.log("异步方法执行完毕");
	},
		readfileSync:function(path){     //同步读取
			var data = fs.readFileSync(path,'utf-8');
			//console.log(data);
			//console.log("同步方法执行完毕");
			return data;
		}
	}
//readfile('C:/www/nodejs/study/aa.txt');
//readfileSync('C:/www/nodejs/study/aa.txt');