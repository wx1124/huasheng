var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log(req.session.loginbean);
	//res.send('hello,华盛');
	res.locals.loginbean = req.session.loginbean;
    res.render('index',{});
});

module.exports = router;//导出router
