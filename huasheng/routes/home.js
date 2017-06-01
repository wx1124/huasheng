var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var PrivateInfoModel = require('../models/PrivateInfoModel');
var Users = require('../models/UserModel');
var sequelize = require('../models/ModelHeader')();
var Msg = require('../models/MsgModel');
var ShopModel = require('../models/ShopModel');
var GoodsModel = require('../models/GoodsModel');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;//将session里面的东西传给本地  
 // res.render('home/home', {});  // 渲染home路径下的home
  if(loginbean.role>0){
    cpage =1;
    if(req.query.cpage){
      cpage=req.query.cpage;
    }
    pageItem=3;//每页显示条目数
    startPoint = (cpage-1)*pageItem;//查询起点位置
    rowCount=0;  //消息总数
    sumPage=0;   //总页数
    //-----------查询消息列表------------
    sqlCount = 'select count(*) as count from msgs where toid=?';
    sequelize.query(sqlCount,{replacements:[loginbean.id],type:sequelize.QueryTypes.QUERY}).then(function(rs){
        rsjson = JSON.parse(JSON.stringify(rs[0]));
        rowCount = rsjson[0].count; 
        sumPage=Math.ceil(rowCount/pageItem);//Math.ceil 向上取整  floor 向下取整  round 四舍五入
     
    //sequelize 用法
    //Msg.findAll({where:{toid:loginbean.id}}).then(function(rs){  //?  占位符  预编译做法
      sql = 'select m.*,u.nicheng from msgs m,users u where m.toid=? and m.sendid=u.id limit ?,?';
      sequelize.query(sql,{replacements:[loginbean.id,startPoint,pageItem],type:sequelize.QueryTypes.QUERY}).then(function(rs){
      console.log(rs);
       res.render('home/home', {rs:rs[0]});  // 渲染  带着数据调到home页面
    })
    });  
  }else{
    res.send('<script>alert("你无权访问此页面");location.href="/";</script>');
  }
});
// router.post('/privateAuth',function(req, res, next){
// 	rname = req.body['rname'];
// 	res.send('rname='+rname);
// });
router.post('/privateAuth', function(req, res, next) {
	var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/privateauth/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){                    //姓名,身份证等放在fields 图片放在files里面
            console.log(err); 
            return;
        } 
       // console.log( fields)//这里就是post的XXX 的数据 
       // console.log( files.idphoto)//这里就是上传的文件,注意,客户端file框必须有name属性 
       // console.log('上传的文件名:'+files.idphoto.name);//与客户端file同名 
       // console.log('文件路径:'+files.idphoto.path); 
       //res.send('rname='+fields.realname);
       //-----------入库-------------
       loginbean = req.session.loginbean;
       fields.id= loginbean.id;         //直接在根路径下查看照片
       fields.idphoto=files.idphoto.path.replace('public','');//存入的位置
       fields.userphoto=files.userphoto.path.replace('public','');
       fields.updtime=new Date();
       //---------启动事物---------------
       sequelize.transaction().then(function(t){  //创建事物  事物启动成功  then回调 function(t)
       return PrivateInfoModel.create(fields).then(function(rs) { //插入文件 插入成功 回调结果
	    //res.send('身份认证已提交，请耐心等待审核');			  //返回
	    //-----------修改User表中的role为2-------
		return Users.update({role:2},{where:{'id':loginbean.id}}).then(function(rs){
		//console.log(rs);
		loginbean.role=2;
		req.session.loginbean=loginbean;
		res.send('身份认证已提交，请耐心等待审核');
	});  //事物提交  有错误回滚  没错误入库
	}).then(t.commit.bind(t)).catch(function(err) {    //catch 解决异常 防止服务器崩溃   异常是可以解决的   try是捕获
 		t.rollback.bind(t);
 		console.log(err);
 		if(err.errors[0].path=='PRIMARY'){
 			res.send('您已经申请过');
 		}else if(err.errors[0].path=='idcodeuniq'){
 			res.send('身份证号已用过');
		}else if(err.errors[0].path=='prphoneuniq'){
			res.send('手机号重复');
		}else if(err.errors[0].path=='premailuniq'){
			res.send('邮箱重复');
		}else{
			res.send('数据库错误，稍后再试');
		}
})
	
  });
	//------------结束事物--------------
    })
})
router.get('/pubShop', function(req, res, next) {
    sql = 'select id,typename from shoptypes';
  sequelize.query(sql).then(function(rs){
    res.render('home/pubShop', {shoptypeRs:rs[0]});
  });
})

router.post('/pubShop', function(req, res, next) { //表单提交
    var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/shop/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err); 
            return;
        } 
       //res.send('rname='+fields.realname);
       //-----------入库------------
       loginbean = req.session.loginbean;
       fields.uid = loginbean.id;
       fields.photourl=files.photourl.path.replace('public','');
       //------------启动事物----------------------------------
       sequelize.transaction().then(function (t) {
           return ShopModel.create(fields).then(function(rs){

            //------修改User表中的role为4------
            return Users.update({role:4},{where:{'id':loginbean.id}}).then(function(rs){
              //console.log(rs);
              loginbean.role=4;
              req.session.loginbean=loginbean;
              res.redirect('./shopmanage');
            });


          }).then(t.commit.bind(t)).catch(function(err){
            t.rollback.bind(t);
            console.log(err);          
        })    
      //-----------------结束事物------------------------
    });
  });
});


router.post('/mapmsg', function(req, res, next) {
      res.locals.loginbean = req.session.loginbean;
      uid = res.locals.loginbean.id;
      shopname = req.body.shopname;
      content = req.body.content;
      point = req.body.point;    //从前台获取需要的东西 定义变量 使用
      sqlmap = 'insert into maps set uid=?,title=?,shopmsg=?,sposition=?';
      sequelize.query(sqlmap,{replacements:[uid,shopname,content,point]}).then(function(rs){
        res.send('1');

      })
    })
router.post('/delmap',function(req,res,next){
  res.locals.loginbean=req.session.loginbean;
  uid = res.locals.loginbean;
  sql ='delete from maps where uid=?';
  sequelize.query(sql,{replacements:[uid]}).then(function(rs){
    res.redirect('/home/pubShop');
  })
});

router.get('/shopmanage', function(req, res, next) {
   console.log("2111111111111111111111111111");
  //---------判定权限-------------- 
  loginbean = req.session.loginbean;
  if (loginbean.role ==4 ) {
     //--------查询出店铺位置信息--先管安全--------------------
  sql = 'select * from shops where uid = ?';
  //----------回调地狱-sequelize嵌套-------------------
  sequelize.query(sql,{replacements:[loginbean.id]}).then(function(shopRs){
     //  console.log(rs);
  //--------用店铺信息渲染地图界面-------------------------v  
     sqlSelect = 'select id,typename from shoptypes ';
     sequelize.query(sqlSelect).then(function(shoptypeRs){
       //----------查询店铺中的商品信息---------------
       page=1;
       if(req.query.page){
        page=req.query.page;
       }
          pageSize=2;
           GoodsModel.count({where:{uid:loginbean.id}}).then(function(countRs){
       GoodsModel.findAll({where:{uid:loginbean.id},offset:(page-1)*pageSize,limit:pageSize}).then(function(goodsRs){
         res.render('home/shopmanage', {shoptypeRs:shoptypeRs[0],shopRs:shopRs[0],goodsRs:goodsRs});
           console.log("333333333333333333333333333333333");
       })
        });

    })
   })

   }else{
      res.send('请先发布您的营业点');
     // res.send('<script>alert("你无权访问此页面");location.href="/";</script>');

   }
});


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

router.post('/updgoods', function(req, res, next) {
    var goodsid = req.query.id;
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
       if(files.goodsimg.name){
         fields.goodsimg=files.goodsimg.path.replace('public','');
       }else{
         fields.goodsimg=fields.oldGoodsImg;
         console.log(fields.goodsimg);
       }
       fields.goodsintro=fields.editorValue;
       //------------启动事物----------------------------------
       GoodsModel.update(fields,{where:{'id':goodsid}}).then(function(rs){
          console.log(rs);
          res.redirect('./shopmanage?tagflag=1');
       }).catch(function(err){
          console.log(err);
          res.send('创建失败');
       })
       
      //-----------------结束事物---------------------------------------
    })
})


//修改
router.post('/revise',function(req,res,next){
    var form = new formidable.IncomingForm();   //创建上传表单 
    // form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/shop/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err);  
            return;
        } 
       //res.send('rname='+fields.realname);
       //-----------入库------------
       loginbean = req.session.loginbean;
       fields.uid = loginbean.id;
       
      fields.photourl=files.photourl.path.replace('public','');
        //console.log('-----------------------'+fields.photourl);
       //------------启动事物----------------------------------
         ShopModel.update(fields, {where:{'uid':loginbean.id}}).then(function(rs){

            //------修改User表中的role为4------
          
              res.redirect('./shopmanage');
          
            console.log(err);          
        })    
      //-----------------结束事物------------------------
       res.send('1');
    });

  });
router.get('/getGoodsInfo', function(req, res, next) {
      //接参
      goodsid = req.query.id;
      GoodsModel.findOne({where:{id:goodsid}}).then(function(goodsRs){
         res.send(goodsRs);

       })

})  

router.post('/closeshop', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;
      console.log("222222222222222222222222222222");
      sql='update shops set liveflag=1 where uid=?';
      sequelize.query(sql,{replacements:[loginbean.id]}).then(function(shops){
        console.log(shops);
      })
  });


module.exports = router;
//render 渲染的路由前一定不能有  /  ,它是拿到数据,跳到客户端，ejs 
//,他不是一个路由，不在地址栏显示。仅仅拿到数据放到客户端的分支,显示客户端，可能没有数据。 