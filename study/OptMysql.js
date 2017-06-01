var mysql = require('mysql');//调用MySQL模块
//定义一个conne连接
var connection = mysql.createConnection({
	host:'localhost',         //主机
	user:'root',			  //MySQL认证用户名
	password:'root',		  //MySQL认证用户密码
	database:'huasheng',
	port:'3306'				  //端口号
});
//获得一个connection
connection.connect(function(err){
	if(err){
	console.log('[query] - :'+err);
	return;
	}
	console.log('[connection connect] succeed!');
});
//执行SQL语句
connection.query('insert into users set email="admin3",pwd="admin",nicheng="admin2",role=0',function(err,rs,fields){
	if(err){
	console.log('[query] - :'+err);
	return;
}
console.log(rs);
//console.log('The solution is:',rows[0].email);
});
//关闭connectinon
/*connection.end(function(err){
	if(err){
	return;
}
console.log('[connection end] succeed!');
});*/