var express = require('express');
var router = express.Router();
var GoodsModel = require('../models/GoodsModel');
var ShoppingModel = require('../models/ShoppingModel');
var sequelize = require('../models/ModelHeader')();


/* GET home page. */
router.get('/', function(req, res, next) {
	res.locals.loginbean = req.session.loginbean;
	if(typeof(loginbean)=="undefined"){ //判断用户是否登录
		res.send('<script>alert("您还没有登录，请登录后操作");window.close();</script>');
		return;
	}
	//------查询goods表--------查询需要的东西
	goodsid = req.query.goodsid;
	GoodsModel.findOne({where:{id:loginbean.id}}).then(function(goodsRs){
		//------插入购物意向表----- 
		shop ={
			goodsid:goodsid,
			uid:loginbean.id,
			price:goodsRs.price,
			num:1,
			shopid:goodsRs.shopid,
			createtime:new Date()
		};
		ShoppingModel.create(shop).then(function(rs){
			console.log(rs);
			//------查询购物意向表-----
			ShoppingModel.findAll({where:{uid:loginbean.id}}).then(function(shopList){
				//-----显示购物车----------
				res.render('buy/shoppingcar',{shopList:shopList});
			});
		}).catch(function(err){
			console.log(err);
			if(err.errors[0].path=='shoppinguniq'){
				ShoppingModel.update({num:sequelize.literal('num+1')},{where:{'goodsid':goodsid,'uid':loginbean.id,'orderid':0}}).then(function(rs){
					//-----------查询购物车意向表---------
					ShoppingModel.findAll({where:{uid:loginbean.id}}).then(function(shopList){
						//------------显示购物车--------------
						res.render('buy/shoppingcar',{shopList:shopList});
					});
				})
			}else{
				res.send('数据库错误，请稍后再试');
			}

		})
	})
});

module.exports = router;//导出router
