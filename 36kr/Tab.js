//页面加载完调用此函数
window.onload = function () {
	// 第1个选项卡
	tabs({
		//tab类
		newClass: 'new',
		//面板类
		tabs_contentClass: 'tabs_content',
		//触发事件
		tiggerEvent: 'onmouseover',
	});

	// 第2,3个选项卡
	ones({
		//tab类
		newClass: 'tab2',
		//面板类
		tabs_contentClass: 'spec',
		//触发事件
		tiggerEvent: 'onmouseover',
	});
}

//
function tabs(options) {
	if (!options.newClass) {
		alert('必须制定newClass选项');
	}

	if (!options.tabs_contentClass) {
		alert('必须制定tabs-contentClass选项');
	}

	if (!options.tiggerEvent) {
		alert('必须制定tiggerEvent选项');
	}

	var bool	= true;
	var string	= "wangshikun";
	var date	= new Date();
	var time	= (new Date()).getTime();
	var person	= {
		name: "wangshikun",
		age: 19
	};

	// alert(person.name);
	// alert(person.age);

	//在li元素里找到class为tab类的元素
	var news = getElementsByClassName('a', options.newClass);
	//在div元素里找到class为panel的元素
	var tabs_contents = getElementsByClassName('div', options.tabs_contentClass);

	for (var i=0, length=news.length; i<length; i++) {
		news[i][options.tiggerEvent] = function () {

			// 处理面板
			for (var j=0; j<tabs_contents.length; j++) {
				tabs_contents[j].style.display = "none";
			}
			var currentPanel = document.getElementById(this.getAttribute('target'));
			if (currentPanel) {
				currentPanel.style.display = "block";
			}

			// 处理选项卡
			for (var j=0; j<news.length; j++) {
				news[j].className = "tabs-content";
			}
			this.className = "tabs-content active";
		}
	}
}


//
function ones(options) {
	if (!options.newClass) {
		alert('必须制定newClass选项');
	}

	if (!options.tabs_contentClass) {
		alert('必须制定tabs-contentClass选项');
	}

	if (!options.tiggerEvent) {
		alert('必须制定tiggerEvent选项');
	}

	//在li元素里找到class为tab类的元素
	var news = getElementsByClassName('a', options.newClass);
	//在div元素里找到class为panel的元素
	var tabs_contents = getElementsByClassName('ul', options.tabs_contentClass);

	for (var i=0, length=news.length; i<length; i++) {
		news[i][options.tiggerEvent] = function () {

			// 处理面板
			for (var j=0; j<tabs_contents.length; j++) {
				tabs_contents[j].style.display = "none";
			}
			var currentPanel = document.getElementById(this.getAttribute('target'));
			if (currentPanel) {
				currentPanel.style.display = "block";
			}

			// 处理选项卡
			for (var j=0; j<news.length; j++) {
				news[j].className = "tabs-content";
			}
			this.className = "tabs-content active";
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

function getElementById(event) {
	var event = event || window.event;
	return event;
}

