/*APP基本配置参数*/
var CONFIG={
	WEB_SERVER:"",//主站域名http://sj.fytest.com:8080/
	IMMERSTION_COLOR: "#FF8C00",//沉浸式状态栏部分颜色
	STORAGE_PRE:"GSFANGYUAN_",//本地缓存
}

if(localStorage.getItem(CONFIG.STORAGE_PRE+'WEB_SERVER')){
	CONFIG.WEB_SERVER=localStorage.getItem(CONFIG.STORAGE_PRE+'WEB_SERVER');
}