var Sequelize = require('sequelize');//引入一个框架
var seqConn = null;
var sequelize = function(){
	if (seqConn==null) {
		console.log('创建连接');
		seqConn= new Sequelize('huasheng','root','root',{
		host:'127.0.0.1',        //库名       昵称   密码
		dialect:'mysql'    //连接数据库
});
	}
	return seqConn;
}
 
module.exports = sequelize;
