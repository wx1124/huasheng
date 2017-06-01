var express = require('express');
var router = express.Router();
var sequelize = require('../models/ModelHeader')();
var PrivateInfoModel = require('../models/PrivateInfoModel');
var User = require('../models/UserModel');
var Msg = require('../models/MsgModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;//将session里面的东西传给本地  
  //res.render('admin/adminHome', {});  // 渲染
  if(loginbean.role==0){
  	res.render('admin/adminHome', {});  // 渲染
  }else{
  	res.send('<script>alert("你无权访问此页面");location.href="/";</script>');
  }
});
router.get('/authList', function(req, res, next) {
	res.locals.loginbean = req.session.loginbean;//将session里面的东西传给本地  
	  if(loginbean.role==0){
	  	//-----------显示列表--------
	  	sql = 'select p.* from privateinfos p,users u where u.role=2 and u.id=p.id';
	  	sequelize.query(sql).then(function(rs){  //query 将sql字符串 转换为字符串
	  		//res.send(rs[0]);         res.locals.rs=rs[0];
	  		res.render('admin/authList',{rs:rs[0]});//0表示打印的结果是一次
	  	});

	  	//---------------------------
	  }else{
	  	res.send('<script>alert("你无权访问此页面");location.href="/";</script>');
	  }
});

router.get('/authInfo', function(req, res, next) {
	//----------查库--------------
	id = req.query.id;  //get方式  ？用query接收
		PrivateInfoModel.findOne({where:{id:id}}).then(function(rs){
		if(rs!=null){
			res.render('admin/authData',{rs:rs});//渲染
			//把authData文件里面的东西读取出来发送给客户端   
	 				
		}else{
			res.send('查无此信息');
		}
	});
})  

router.get('/applyPass', function(req, res, next) {
	res.locals.loginbean = req.session.loginbean;//将session里面的东西传给本地  
   if(loginbean.role==0){
  	id = req.query.id;
  	sql = 'update users set role=3,msgnum=msgnum+1 where id=?'; //消息每次加1
  	sequelize.query(sql,{replacements:[parseInt(id)],type:sequelize.QueryTypes.UPDATE}).then(function(rs){
  																							//回调函数
  			 //执行   sql语句 替换？里面的id  parseInt 解析字符串 返回整数	
  		//console.log(rs); //控制台输出结果
  	sqlmsg = 'insert into msgs set sendid=?,toid=?,message="您的vip审核已通过，请进入空间发布您的租赁信息"';
  		sequelize.query(sqlmsg,{replacements:[loginbean.id, id]}).then(function(rs){
  			res.redirect('./authList'); //界面返回到authList界面
  		})
  	})
  }else{	  
  	res.send('<script>alert("你无权访问此页面");location.href="/";</script>');
  }
});  
router.post('/applyRefuse', function(req, res, next) {
	res.locals.loginbean = req.session.loginbean;//将session里面的东西传给本地  
   if(loginbean.role==0){
  	id = req.body.id;
  	message = req.body.message; //
  	//1.修改users表中role=1，msgnum+1
  	//2.msgs中插入，sendid=loginbean.id,toid=id,message=
 //  	sql = 'update users set role=1,msgnum=msgnum+1 where id=?';
 //  	sequelize.query(sql,{replacements:[parseInt(id)],type:sequelize.QueryTypes.UPDATE}).then(function(rs){
 //  		console.log(rs);
 //  		sqlmsg = 'insert into msgs set sendid=?,toid=?,message=?';
 //  		sequelize.query(sqlmsg,{replacements:[loginbean.id, id,message]}).then(function(rs){
 //  			res.redirect('./authList'); //界面返回到authList界面
 //  		})
	// })
  //---------启动事物---------------保证事物一起成功或者一起失败
       sequelize.transaction().then(function(t){  //创建事物  事物启动成功  then回调 function(t)
       return User.update({role:1,msgnum:sequelize.literal('msgnum+1')},{where:{'id':id}},{transaction:t}).then(function(rs) { //插入文件 插入成功 回调结果
       msg={};
       msg.sendid=loginbean.id;
       msg.toid=id;
       msg.message=message;
      //-----------修改User表中的role为2-------
    return Msg.create(msg,{transaction:t}).then(function(rs){
    res.redirect('./authList');
  });  
  }).then(t.commit.bind(t)).catch(function(err) {    //catch 解决异常 防止服务器崩溃   异常是可以解决的   try是捕获
    t.rollback.bind(t);  //事物回滚
    console.log(err);
})
  
  });
  //------------结束事物--------------
  	}else{	  
  	res.send('<script>alert("你无权访问此页面");location.href="/";</script>');
  }
})


router.post('/pubgoods', function(req, res, next) {
    var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/goods/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err); 
            return;
        } 
        
       //-----------入库------------
       loginbean = req.session.loginbean;
       fields.uid = loginbean.id;
       fields.goodsimg=files.goodsimg.path.replace('public','');
       console.log('----------------------');
       console.log(fields.editorValue);
       console.log('----------------------');
       fields.goodsintro=fields.editorValue;
       fields.createtime=new Date();
       //------------启动事物----------------------------------
       GoodsModel.create(fields).then(function(rs){
          console.log(rs);
          res.redirect('./shopmanage');
       }).catch(function(err){
          console.log(err);
          res.send('创建失败');
       })
      //-----------------结束事物---------------------------------------
    })
})

router.post('/pubgoods', function(req, res, next) {
    var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/goods/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err); 
            return;
        } 
        
       //-----------入库------------
       loginbean = req.session.loginbean;
       fields.uid = loginbean.id;
       fields.goodsimg=files.goodsimg.path.replace('public','');
       console.log('----------------------');
       console.log(fields.editorValue);
       console.log('----------------------');
       fields.goodsintro=fields.editorValue;
       fields.createtime=new Date();
       //------------启动事物----------------------------------
       GoodsModel.create(fields).then(function(rs){
          console.log(rs);
          res.redirect('./shopmanage');
       }).catch(function(err){
          console.log(err);
          res.send('创建失败');
       })
      //-----------------结束事物---------------------------------------
    })
})
module.exports = router;	