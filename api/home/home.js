home = {
	//获取现场检测业务列表
	getBizQuery: function(postInfo, callback) {
		var ajax=new ajaxRequest();
		ajax.request("BizQuery/GetMultiple",postInfo,function(data){
			callback(data);
		})		
	},
	//获取业务单仪器编号
	getMacOptionItem:function(postInfo,callback){
		var ajax=new ajaxRequest();
		ajax.request('OptionItem/GetMultiple',postInfo,function(data){
			callback(data);
		})
	},
	//获取详情
	getBizQueryDetail:function(postInfo,callback){
		var ajax=new ajaxRequest();
		ajax.request('BizQuery/GetSingle',postInfo,function(data){
			callback(data);
		});
	}
}
