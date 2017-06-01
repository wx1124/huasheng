var http = require('http');//导包
var url = require('url');
var router = require('./router');
http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
		//收藏夹
		if(request.url!=="/favicon.ico"){//清除第2此访问
       console.log('访问');

	console.log(request.url);
	//调用
	var pathname=url.parse(request.url).pathname;
	pathname = pathname.replace(/\//,'');
	console.log("pathname:"+pathname);
	router.readHtml(pathname,response);
	/*if(router[pathname]){
		router[pathname](request,response);
	}else{
		response.write('500');
	}*/

       //response.end('');//不写则没有http协议尾，但写了会产生两次访问
       }
}).listen(8000);
console.log('Server running at http://127.0.0.1:8000/');