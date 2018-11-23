admin = {
	//登录
	userLogin: function(postInfo, callback) {
		var ajax=new ajaxRequest();
		ajax.request("User/Login",postInfo,function(data){
			callback(data);
		})		
	},
	//权限获取
	getAuth:function(postInfo,callback){
		var ajax=new ajaxRequest();
		ajax.request("UserFunction/GetMultiple",postInfo,function(data){
			callback(data);
		})		
	}
}
