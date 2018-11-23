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
	},
	//获取添加项目
	getTestItem:function(postInfo,callback){
		var ajax=new ajaxRequest();
		ajax.request('TestItem/GetMultiple',postInfo,function(data){
			callback(data);
		});
	},
	//新增项目
	createSampleItem:function(postInfo,callback){
		var ajax=new ajaxRequest();
		ajax.request('SampleItem/Create',postInfo,function(data){
			callback(data);
		});
	},
	//删除项目
	deleteSampleItem:function(postInfo,callback){
		var ajax=new ajaxRequest();
		ajax.request('SampleItem/Delelte',postInfo,function(data){
			callback(data);
		});
	},
	//提交现场检测单
	submitScene:function(postInfo,callback){
		var ajax=new ajaxRequest();
		ajax.request('Sampling/Submit',postInfo,function(data){
			callback(data);
		});
	}
}
