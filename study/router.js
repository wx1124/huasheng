//导出纯方法
//对象
var read = require('./readfile.js');
module.exports={
	readHtml:function(pathname,res){
		//var html = read.readfileSync('C:/www/nodejs/study/'+pathname+'.html');
		//res.end(html);
	},
	login:function(req,res){
		read.readfile('C:/www/nodejs/study/aa.txt',res);
		//read.readfileSync('C:/www/nodejs/study/login.html',res);
		var html = read.readfileSync('C:/www/nodejs/study/login.html');
		res.end(html);
		//res.write('欢迎登陆');
	},
	zhuce:function(req,res){
		read.readfile('C:/www/nodejs/study/aa.txt',res);
		res.write('注册成功');
	}
}
//router.login();
//router['login'];

/*三个等价
var obj = {id:1,name:'zhangsan'};
var obj = new Object();
	id=1;
	name='zhangsan';
var obj = {
	id=1,
	name='zhangsan';
	}
	*/