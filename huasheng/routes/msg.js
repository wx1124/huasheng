var express = require('express');
var router = express.Router();
var sequelize = require('../models/ModelHeader')();


/* GET users listing. */
router.post('/sendmsg', function(req, res, next) {
	//res.locals.loginbean = req.session.loginbean;
	 loginbean = req.session.loginbean;
     res.locals.loginbean = loginbean;
	//接参
	nicheng = req.body.nicheng;
	arr = nicheng.split(';');//用分号将昵称分隔开
	len = arr.length;
	sql = 'select id from users where nicheng=?';
	sqlmsg = 'insert into msgs set sendid=?,toid=?,message=?';//插入消息表
	sqlupd = 'update users set msgnum=msgnum+1 where id=?';//更新user表msgnum+1
	flag =0;   //标志位 
	var exec = function(i){   //闭包     //异步问题，在for循环中农，连续操作数据库，
		toids={}				         //不确定谁先执行，无法向前台输出,使用闭包+标志位
		return function(){
		sequelize.query(sql,{replacements:[arr[i]]}).then(function(rs){
		  rsjson = JSON.parse(JSON.stringify(rs[0]));//rowdatapacke 转换为json对象格式
		   //console.log(rsjson[0]);
		   if(rsjson.length==0){
			 flag++;
			 return;
	}
		toids[i] = rsjson[0].id;
		//console.log(toid);
	sequelize.query(sqlmsg,{replacements:[loginbean.id,toids[i],req.body.message]}).then(function(rs){
            
            sequelize.query(sqlupd,{replacements:[toids[i]]}).then(function(rs){
            	flag++;
            	if(flag==len){
            		res.send('1');
            	}
		     });
           });
       });
	}
	//用昵称查找对应的uid
	}
	for(i=0;i<len;i++){
		fun=exec(i);
		fun();
	}
//返回客户端，客户端收到后弹成功，关闭模态框
});

router.get('/delNew', function(req, res, next) {
	res.locals.loginbean = req.session.loginbean;
	id = req.query.id; 
	sqldel = 'delete from msgs where id=?';
	sequelize.query(sqldel,{replacements:[id]}).then(function(rs){
		sqlupd = 'update  msgs set msgnum=msgnum-1 where id=?'; 
		sequelize.query(sqlupd,{replacements:[loginbean.id]}).then(function(rs){
            	res.redirect('/home');
          })
	})
});
module.exports = router;