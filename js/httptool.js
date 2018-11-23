// 二次封装mui.ajax
var ajaxRequest=function(){
	var own=this;
	own.request=function(url,postdata,callback){		
		if(apptools.getUserInfo()){			
			var userInfo=JSON.parse(apptools.getUserInfo());
			postdata.access_token=userInfo.access_token;
		}
		postdata2=JSON.stringify(postdata);
		mui.ajax(CONFIG.WEB_SERVER + url, {
			data: JSON.stringify(postdata2),
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Content-Type': 'application/json;charset=urf-8'
			},
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登录成功；
				console.log(data);
				var data2=JSON.parse(data);								
			    callback(data2);								
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				mui.toast(type);
				callback(type);
			}
		})
	}
}