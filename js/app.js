/*app公共方法*/

/*rem适配方案*/
document.documentElement.style.fontSize = document.documentElement.clientWidth / 640*100 + 'px';

//app工具方法
var first = false; //返回键初值
var apptools = {
	/*
	 * 判断上下午
	 */
	dealApm: function() {
		now = new Date(), hour = now.getHours()
		if(hour < 12) {
			return true;
		} else {
			return false;
		}
	},
	/*删除指定文件*/
	delFile: function(locaPath, callback) {
		callback = callback || mui.noop;
		plus.io.resolveLocalFileSystemURL(locaPath, function(entry) {
			entry.remove(function(entry) {
				callback(1);
			}, function(e) {
				callback(0);
			});
		});
	},
	//删除数组特定元素
	removeByValue: function(arr, val) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] == val) {
				arr.splice(i, 1);
				break;
			}
		}
	},
	/*把版本号转为3位有效数字*/
	fmtVersion: function(str) {
		var arr = [];
		var version = 0;
		if(str) {
			arr = str.split('.');
			version = parseInt((arr[0] || '0') + (arr[1] || '0') + (arr[2] || '0'));
		}
		return version;
	},
	/*
	 * 日期转时间戳
	 */
	convertStamp: function(dateString) {
		var str = dateString.replace(/-/g, '/');
		var date = new Date(str);
		var stamp = date.getTime();
		return stamp;
	},
	/*
	 * 插入元素
	 */
	insertAfter: function(newElement, targetElement) {
		var parent = targetElement.parentNode;
		if(parent.lastChild == targetElement) {
			parent.appendChild(newElement);
		} else {
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	},
	/*
	 * 單選框的值
	 */
	radioButtonListener: function(className) {
		var rdsObj = document.getElementsByClassName(className);
		var checkVal;
		for(i in rdsObj) {
			if(rdsObj[i].checked) {
				checkVal = rdsObj[i].value;
			}
		}
		return checkVal;
	},
	/*
	 * 弹出软键盘
	 */
	showKeyboard: function() {
		var nativeWebview, imm, InputMethodManager;
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var Context = plus.android.importClass("android.content.Context");
			InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
		} else {
			nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
		}
		if(mui.os.android) {
			imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
		} else {
			nativeWebview.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
		}
		setTimeout(function() {
			var inputElem = document.querySelector('input');
			inputElem.focus();
			inputElem.parentNode.classList.add('mui-active'); //第一个是search，加上激活样式
		}, 200);
	},
	getZipImg: function(imgPath, callback) {
		//获得一个压缩图片
		plus.io.resolveLocalFileSystemURL(imgPath, function(entry) {
			entry.file(function(file) {
				if(file.size / 1024 > 200) {
					var dsts = IMGUPDIR + file.name;
					//判断目标图片是否已压缩，若已经压缩过则直接使用，否则压缩
					plus.io.resolveLocalFileSystemURL(dsts, function(entry) {
						entry.file(function(file) {
							file.url = 'file://' + file.fullPath;
							callback(file);
						});
					}, function(error) {
						//目标图片没有压缩过则压缩
						lessen = Math.sqrt((200 * 1024 * 8) / (file.size * 24)) * 100 + '%';
						dsts = IMGUPDIR + file.size + file.name;
						plus.zip.compressImage({
							src: imgPath,
							dst: dsts,
							quality: 50,
							format: 'jpg',
							width: lessen,
							height: lessen,
							overwrite: true
						}, function(zipImg) {
							zipImg.url = zipImg.target;
							callback(zipImg);
						}, function(err) {
							callback(null);
						})
					})
				} else {
					file.url = 'file://' + file.fullPath;
					callback(file);
				}
			});
		}, function(err) {
			callback(null);
		});
	},
	/*
	 * base转码
	 */
	getBase64: function(path, callback) {
		callback = callback || mui.noop;
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			entry.file(function(file) {
				var reader = new plus.io.FileReader();
				reader.onloadend = function(evrnt) {
					// Get base64 data
					fileBase = {
						data: evrnt.target.result,
						type: 'image'
					};
					callback(fileBase)
				};
				reader.readAsDataURL(file);
			})
		}, function(err) {
			console.log('文件路径错误')
		})
	},
	/*
	 * 判断是否登陆
	 */
	isLoginOrNot: function() {
		var userInfo = localStorage.getItem(CONFIG.STORAGE_PRE+'userInfo');
		if(!userInfo) {
			return false;
		} else {
			return true;
		}
	},
	/*
	 * 跳转到登录页面
	 */
	gotoLogin: function() {
		webtool.openPreView('../../ucenter/view/ucenter-login', function(wb) {
			wb.show('pop-in', 300);
		})
	},
	quitLoginInformWebview: function(wb) {
		var allActivity = plus.webview.all();
		for(var i in allActivity) {
			mui.fire(allActivity[i], 'userChange', {
				data: false
			});
		}
		apptools.clearUserInfo();
		mui.toast('已注销');
		webtool.openPreView('../../ucenter/view/ucenter-login', function(wb) {
			wb.show('fade-in', 400);
		});
	},
	/*
	 * 登陆成功后的通知事件
	 */
	loginInformWebview: function(data) {
		var waiting = apptools.showNativeWaiting();
		apptools.setUserInfo(data);
		webtool.openPreView('../../index/view/index-main', function(wb) {
			setTimeout(function() {
				waiting.close();
				var allActivity = plus.webview.all();
				for(var i in allActivity) {
					mui.fire(allActivity[i], 'userChange', {
						data: true
					});
				}
				mui.toast('登录成功');
				wb.show('fade-in', 300);
			}, 1000);
		})
	},
	/*
	 * 吐司，waiting
	 */
	showNativeWaiting: function(toastInfo) {
		if(toastInfo) {
			mui.toast(toastInfo);
		}
		var waiting = plus.nativeUI.showWaiting();
		return waiting;
	},
	/*
	 * 验证手机
	 */
	checkMobile: function(tel) {
		var mblRegx = /^1[3|4|5|7|8]\d{9}$/;
		if(!mblRegx.test(tel)) {
			mui.alert('请输入正确的手机号码');
			return false;
		}
		return true;
	},
	/**获取本地是否安装客户端
	 * 
	 * @param {String} id
	 */
	isInstalled: function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	},
	/*
	 * 时间戳加上下午
	 */
	friendlyDate2: function(unix, apm) {
		var apm = apm || "";
		if(!unix) return '';
		var myDate = new Date(unix * 1000);
		var Year = myDate.getFullYear();
		var Month = myDate.getMonth() + 1;
		var Day = myDate.getDate();
		var newMonth, newDay, apmTx;
		if(Month < 10) {
			newMonth = "0" + Month;
		} else {
			newMonth = Month;
		}
		if(Day < 10) {
			newDay = "0" + Day;
		} else {
			newDay = Day;
		}
		if(apm) {
			apm == '0' ? apmTx = "上午" : apmTx = "下午";
			return Year + "-" + newMonth + "-" + newDay + "  " + apmTx;
		} else {
			return Year + "-" + newMonth + "-" + newDay;
		}
	},
	friendlyDate3: function(sTime) {
		if(!sTime) return '';
		var myDate = new Date(sTime * 1000);
		var Year = myDate.getFullYear();
		var Month = myDate.getMonth() + 1;
		var Day = myDate.getDate();
		if(Month < 10) {
			Month = "0" + Month;
		}
		if(Day < 10) {
			Day = "0" + Day;
		}
		return Year + "." + Month + "." + Day;
	},
	/**
	 * 时间戳友好解析
	 * @param {Object} sTime
	 */
	friendlyDate: function(sTime) {
		if(!sTime) return '';
		var myDate = new Date(sTime * 1000);
		var Year = myDate.getFullYear();
		var Month = myDate.getMonth() + 1;
		var Day = myDate.getDate();
		var hour = myDate.getHours();
		var minutes = myDate.getMinutes();
		var second = myDate.getSeconds();
		if(Month < 10) {
			Month = "0" + Month;
		}
		if(Day < 10) {
			Day = "0" + Day;
		}
		if(hour < 10) {
			hour = "0" + hour;
		}
		if(minutes < 10) {
			minutes = "0" + minutes;
		}
		if(second < 10) {
			second = "0" + second;
		}
		return Year + "." + Month + "." + Day + "  " + hour + ":" + minutes + ":" + second;
	},

	/**
	 * 时间戳解析 改
	 * @param {int} unixTime
	 * @param {Object} type
	 */
	fmtUnixTime: function(unixTime, type) {
		return apptools.friendlyDate(unixTime);
	},
	//给页面注册一个失去焦点事件，专用于解决ios系统下input控件不会自动失去焦点
	iosBlur: function() {
		window.addEventListener('touchstart', function(e) {
			if(e.target.tagName != "INPUT") {
				document.activeElement.blur();
			}
		})
	},
	/*
	 * 隐藏身份证和手机号码部分信息
	 * type: id是身份证 mobile是手机
	 */
	hideIdentityInfo: function(item, type) {
		var hidNum = 12;
		type == 'id' ? hidNum = 12 : hidNum = 6;
		var repString = item.replace(item.substr(3, hidNum), "******");
		return repString;
	},

	getUserInfo: function() {
		var userInfo = localStorage.getItem(CONFIG.STORAGE_PRE+'userInfo');
		return userInfo;
	},
	/*
	 * 注销，清除用户信息
	 */
	clearUserInfo: function() {
		localStorage.setItem(CONFIG.STORAGE_PRE+'userInfo', '');
		localStorage.setItem(CONFIG.STORAGE_PRE+'WEB_SERVER','');
	},
	/*
	 * 保存用户信息
	 */
	setUserInfo: function(data) {
		localStorage.setItem(CONFIG.STORAGE_PRE+'userInfo', JSON.stringify(data));
	},
	/*
	 * 确认是否退出app
	 */
	confirmQuit: function() {
		var btnArray = ['否', '是'];
		mui.confirm('是否退出app', '友情提示', btnArray, function(e) {
			if(e.index == 1) {
				plus.runtime.quit();
			}
		})
	},
	/*
	 * 两个dom的显示&隐藏
	 * @param{obj,obj,boolean}
	 */
	changePage: function(showObj, hideObj, key) {
		if(key) {
			showObj.style.display = "";
			hideObj.style.display = "none";
		} else {
			showObj.style.display = "none";
			hideObj.style.display = "";
		}
	},
	/*
	 * 单个dom的显示&隐藏
	 * @param{obj,boolean}
	 */
	showHide: function(targetdom, key) {
		key == true ? targetdom.style.display = "" : targetdom.style.display = "none";
	},
	/*
	 * 重写返回键
	 */
	backQuit: function() {
		mui.back = function() {
			//首次按键，提示'再按一次退出程序'
			if(!first) {
				first = new Date().getTime();
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					first = false;
				}, 1000);

			} else {
				if(new Date().getTime() - first < 1000) {
					plus.runtime.quit();
				}
			}
		}
	},
	/*loading*/
	loading:function(desc){
		desc=desc || "加载中...";
		var loading=plus.nativeUI.showWaiting( desc,{  loading:{ icon:''}} );
		return loading;
	}
};

//页面辅助方法
var webtool = {
    /*
	 * 返回关闭页面，用于一些不常用的页面，避免预载页面过多消耗性能
	 */
	backQuit: function() {
		mui.back = function() {
			var wb = plus.webview.currentWebview();
			wb.close();
		}
	},
	/*
	* 返回隐藏页面
	*/
	backHide:function(){
		mui.back=function(){
			var wb=plus.webview.currentWebview();
			wb.hide();
		}
	},	
	/*打开页面二次封装*/
	openWindow:function(webview,data,immser){
		var webId = webview;
		if(~webId.indexOf('/')) {
			webId = webId.substr(webId.lastIndexOf('/') + 1);
		}
        immser=immser || "";
		immser=="" ? immser={ statusbar: { background: CONFIG.IMMERSTION_COLOR }} : immser={};
		mui.openWindow({
			url: webview + '.html',
			id: webId,
			styles: immser,
			extras:data,			
			show:{
				aniShow:"pop-in",
				duration:200
			},
			waiting:{
				title:'加载中...',
				options: {
					/*background:"transparent",
					loading: {
						interval: 100,		
						icon:""
					}*/
				}
			}
			
		});
	}		
};
//下载器
var Downloader = function(netUrl, locaPath) {
	if(mui.os.ios) {
		netUrl = netUrl.replace(/http:\/\//, 'https://');
	}
	var task = plus.downloader.createDownload(netUrl, {
		"filename": locaPath
	});
	
	//错误回调
	var errBack = function(callback){
		task.abort();
		callback(null);
		apptools.delFile(locaPath);
	}
	//开始下载
	this.run = function(callback){
		var intval = setInterval(function(){
			if(task.state == 0){
				errBack(callback);
			}
			clearInterval(intval);
		},1500)
		task.addEventListener("statechanged", function(download, status){
			console.log(status)
			if(download.state == 4) {
				if(status == 200 && download.downloadedSize > 0) {
					callback(download);
					console.log('suc=='+JSON.stringify(download))
				}else{
					errBack(callback);
					console.log('err=='+JSON.stringify(callback))
				}
			} else if(status == 404) {
				//下载失败
				errBack(callback);
			}
		}, false);
		task.start();
	}
}
