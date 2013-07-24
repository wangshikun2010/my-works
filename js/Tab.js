//页面加载完调用此函数
window.onload = function () {
    tabs({
        //tab类
        tabClass: 'tab',
        //面板类
        panelClass: 'panel',
        //触发事件
        tiggerEvent: 'onclick',
    });
}


function tabs(options) {
    if (!options.tabClass) {
        alert('必须制定tabClass选项');
    }

    if (!options.panelClass) {
        alert('必须制定panelClass选项');
    }

    if (!options.tiggerEvent) {
        alert('必须制定tiggerEvent选项');
    }

    //在li元素里找到class为tab类的元素
    var tabs = getElementsByClassName('li', options.tabClass);
    //在div元素里找到class为panel的元素
    var panels = getElementsByClassName('div', options.panelClass);

    for (var i=0, length=tabs.length; i<length; i++) {
        tabs[i][options.tiggerEvent] = function () {

            // 处理面板
            for (var j=0; j<panels.length; j++) {
                panels[j].style.display = "none";
            }
            var currentPanel = document.getElementById(this.getAttribute('target'));
            if (currentPanel) {
                currentPanel.style.display = "block";
            }

            // 处理选项卡
            for (var j=0; j<tabs.length; j++) {
                tabs[j].className = "panel";
            }
            this.className = "panel hover";
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
