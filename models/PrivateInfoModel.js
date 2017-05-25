var Sequelize = require('sequelize');//引入一个框架
var sequelize = require('./ModelHeader')();

var PrivateInfoModel = sequelize.define('Privateinfos', {   //定义一个表的框架
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	realname: Sequelize.STRING,
	idcode: Sequelize.STRING,
	phone: Sequelize.STRING,
	email: Sequelize.STRING,
	address: Sequelize.STRING,
	idphoto: Sequelize.STRING,
	userphoto: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime: Sequelize.DATE,
}, {
	timestamps: false,
	//paranoid: true  //获取不到id的返回值
});

module.exports =PrivateInfoModel;