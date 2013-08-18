//页面加载完调用此函数
window.onload = function () {
	tabs({
		//tab类
		newClass: 'tab2',
		//面板类
		specClass: 'spec',
		//触发事件
		tiggerEvent: 'onmouseover',
	});
}

//
function tabs(options) {
	if (!options.newClass) {
		alert('必须制定newClass选项');
	}

	if (!options.specClass) {
		alert('必须制定specClass选项');
	}

	if (!options.tiggerEvent) {
		alert('必须制定tiggerEvent选项');
	}

	//在li元素里找到class为tab类的元素
	var news = getElementsByClassName('a', options.newClass);
	//在div元素里找到class为panel的元素
	var specs = getElementsByClassName('ul', options.specClass);

	for (var i=0, length=news.length; i<length; i++) {
		news[i][options.tiggerEvent] = function () {

			// 处理面板
			for (var j=0; j<specs.length; j++) {
				specs[j].style.display = "none";
			}
			var currentPanel = document.getElementById(this.getAttribute('target'));
			if (currentPanel) {
				currentPanel.style.display = "block";
			}

			// 处理选项卡
			for (var j=0; j<news.length; j++) {
				news[j].className = "spec";
			}
			this.className = "specactive";
		}
	}
}

/**
 * 给定标签, 和类名选择出符合要求的元素
 * @todo 对于元素的类名的匹配需要改善
 */
function getElementsByClassName(tagName, className) {
	return document.querySelectorAll(tagName + '.' + className);

	var elements = document.getElementsByTagName(tagName);

	if (elements.length <=0 ) {
		return [];
	}

	var return_elements = [];
	for (var i=0, length = elements.length; i<length; i++) {
		if (!elements[i].className || elements[i].className.indexOf(className) < 0) {
			continue;
		}
		return_elements.push(elements[i]);
	}

	return return_elements;

}
