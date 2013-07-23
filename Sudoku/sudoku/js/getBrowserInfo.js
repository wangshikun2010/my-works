/**
 * 获取浏览器类型和版本号
 */
function getBrowserInfo() {
	var BrowserInfo = {};
	this.Browser = "";
	this.Version = "";
	var ua = navigator.userAgent.toLowerCase();

	if (ua.match(/msie/i) != null) {
		this.Version = ua.match(/msie ([\d.]+)/)[1];
		this.Browser = "ie";
	} else if (ua.match(/firefox/i) != null) {
		this.Version = ua.match(/firefox\/([\d.]+)/)[1];
		this.Browser = "firefox";
	} else if (ua.match(/chrome/i) != null) {
		this.Version = ua.match(/chrome\/([\d.]+)/)[1];
		this.Browser = "chrome";
	} else if (ua.match(/opera/i) != null) {
		this.Version = ua.match(/opera.([\d.]+)/)[1];
		this.Browser = "opera";
	} else if (ua.match(/safari/i)!=null) {
		//放到后面判断也是因为Chrome的userAgent还包含了Safari的特征
		this.Version = ua.match(/version\/([\d.]+)/)[1];
		this.Browser = "safari";
	}
	return this;
}

// 调用
var BrowserInfo = getBrowserInfo();
if (BrowserInfo.Browser == "ie" && BrowserInfo.Version > 6) {
	// content
}