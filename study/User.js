//导出类
function User(id,name,age){
    this.id=id;
	this.name=name;
	this.age=age;
	this.enter=function(){
	     console.log('进入图书馆');
		 return '我又出来了';
	}
	this.out=function(res){
	res.write('我是从User中出来的,我的名字叫:'+this.name);
	}
}
module.exports =User;

