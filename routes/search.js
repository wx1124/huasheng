var express = require('express');
var router = express.Router();
SphinxClient = require ("sphinxapi");

/* GET home page. */
router.get('/goods', function(req, res, next) {
	console.log('访问goods');
  //res.locals.loginbean = req.session.loginbean;
  keywords = req.query.keywords;
  kwArr = keywords.split(' ');//用空格分割 |
  len = kwArr.length;
  keyword = '';
  for(i=0;i<len;i++){//循环
  	if(kwArr[i]!=''){
  		keyword += kwArr[i]+'|';
  	}
  }
  var cl = new SphinxClient();
  cl.SetServer('localhost', 9312);
  cl.SetMatchMode(SphinxClient.SPH_MATCH_ANY);		//或运算
  cl.Query(keyword,'goods',function(err, result) {
	        if(err){
	        	console.log(err);
	        	console.log('-------有错-----------');
	        	res.send(err);
	        	return;
	        }
	        console.log(result);
	        for(var key in result['matches']){ //循环查出的id
				console.log(key+':==='+result['matches'][key].id);
			}
			res.send('成功');
   });
  //res.render('index', {});
});


module.exports = router;
