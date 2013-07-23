var isOperatorInputed; //操作状态
var operator; //操作符
var num1; //第一个数
var num2; //第二个数
var buttons = [];
var storage; //储存数据标志变量
var old_operator;
var localvalue;
var ndDisplay = null;
var ndOperator = null;
var audio = null;
var isPlaySoundInputed; //播放声音状态

/**
 * 设置开始状态
 */
window.onload = function setStartState() {
	isPlaySoundInputed = true;
	isOperatorInputed = false;
	operator = "isempty";
	num1 = 0;
	storage = false;
	ndDisplay = document.getElementById('calc_inner_number');
	ndOperator = document.getElementById('calc_inner_operator');
	ndAudio = document.getElementById('audio');
	ndCalcSound = document.getElementById('calc_sound');
	ndSound = document.getElementById('sound');
	ndSound.addEventListener('click',function() {changeSoundMode();},false);
	ndDisplay.innerText = '0';
	bindButtonHandlers();
}

/**
 * 为按钮绑定事件
 */
function bindButtonHandlers() {
	buttons = document.getElementsByTagName('li');
	for (var i=0; i<buttons.length; i++) {
		var text = buttons[i].innerText;
		var buttonHandler = function () {};
		switch(text) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
				buttonHandler = createNumberButtonHandler(text);
				break;
			case '＋':
			case '－':
			case '×':
			case '÷':
				buttonHandler = createOperatorButtonHandler(text);
				break;
			case '.':
				buttonHandler = addPoint;
				break;
			case '=':
				buttonHandler = getResult;
				break;
			case 'AC':
				buttonHandler = clearResult;
				break;
			case 'DEL':
				buttonHandler = deleteNumber;
				break;
			case '+/-':
				buttonHandler = changeNumber;
				break;
			case 'sin':
			case 'cos':
			case 'tan':
			case 'EXP':
			case 'log':
			case '%':
				buttonHandler = createMathFunctionButtonHandler(text);
				break;
			case 'MS':
			case 'MR':
			case 'M＋':
				buttonHandler = createValueButtonHandler(text);
				break;

		}
		buttons[i].addEventListener('click',buttonHandler,false);
	}
}

/**
* 创建1个数字按钮的回调函数
*/
function createNumberButtonHandler(number) {
	return function() {
		addNumber(number);
	}
}

/**
* 创建1个运算符按钮的回调函数
*/
function createOperatorButtonHandler(operator) {
	return function() {
		setOperator(operator);
	}
}

/**
* 创建1个数学函数按钮的回调函数
*/
function createMathFunctionButtonHandler(mathFunction) {
	return function() {
		mathFun(mathFunction);
	}
}

/**
* 创建1个储存数值按钮的回调函数
*/
function createValueButtonHandler(value) {
	return function() {
		localValue(value);
	}
}

/**
 * 添加数字
 */
function addNumber(number) {
	var ndDisplayLength = ndDisplay.innerText.length;
	
	if (storage == true) {
		ndDisplay.innerText = number;
		storage = false;
	} else {
		if (isOperatorInputed == true) {
			ndDisplay.innerText = number;
			isOperatorInputed = false;
		} else {
			if (ndDisplay.innerText == "0") {
				ndDisplay.innerText = number;
			} else {
				if (ndDisplayLength < 12) {
					ndDisplay.innerText += number;
				}
			}
		}
	}

	playSound('./sound/' + number + '.mp3');
}

/**
 * 添加小数点
 */
function addPoint() {
	if ((ndDisplay.innerText).lastIndexOf('.') == -1) {
		console.log('按下了点');
		ndDisplay.innerText += ".";
	} else {
		console.log('按下点没用');
		return false;
	}
	playSound('./sound/point.mp3');
}

/**
 * 设置操作符
 */
function setOperator(oper) {
	isOperatorInputed = true;
	if (operator == "isempty") {
		num1 = ndDisplay.innerText;
		operator = oper;
		ndOperator.innerText = oper;
	} else {
		oper = oper.charAt(oper.length - 1);
		operator = oper;
		getResult();
	}

	switch (oper) {
		case '＋':
			playSound('./sound/jia.mp3');
			break;
		case '－':
			playSound('./sound/jian.mp3');
			break;
		case '×':
			playSound('./sound/cheng.mp3');
			break;
		case '÷':
			playSound('./sound/chu.mp3');
			break;
	}
}

/**
 * 计算结果
 */
function getResult() {
	if (isOperatorInputed == false && ndDisplay.innerText == 0) {
		getNumberMedian(0);
	} else {
		if (operator != "isempty") {
			old_operator = operator;
			var number1 = parseFloat(num1);

			if (storage == true) {
				var number2 = num2;
			} else {
				var number2 = parseFloat(ndDisplay.innerText);
			}
			num2 = number2;

			switch(operator) {
				case "＋":
					result = number1 + number2;
					break;
				case "－":
					result = number1 - number2;
					break;
				case "×":
					result = number1 * number2;
					break;
				case "÷":
					result = number1 / number2;
					break;
			}
			ndOperator.innerText = '';
			num1 = result;
			console.log('' + number1 + operator + number2 + '=' + result);
			ndDisplay.innerText = result;
			operator = "isempty";
			storage = true;
		} else {
			if (storage == true) {
				switch(old_operator) {
					case "＋":
						result = (num1) + (num2);
						break;
					case "－":
						result = (num1) - (num2);
						break;
					case "×":
						result = (num1) * (num2);
						break;
					case "÷":
						result = (num1) / (num2);
						break;
				}
			}
			console.log('' + num1 + old_operator + num2 + '=' + result);
			ndDisplay.innerText = result;
			num1 = result;
		}

		getNumberMedian(result);
	}
}

/**
 * 获取数字的每位数
 */
function getNumberMedian(number) {
	var sequence = [];

	sequence = getSoundSequence(number);

	if ((number.toString()).length < 12) {
		sequence.unshift('equal');
	}

	if (isPlaySoundInputed == true) {
		var soundSequence = new SoundSequence(sequence);
		soundSequence.play();
	}
}

/**
 * 把数字转换为声音序列
 */
function getSoundSequence(number) {
	var numPart;
	var digitPart;
	var number = number.toString();
	var digitPos = number.indexOf(".");
	var sequence = [];
	var array1 = [], array2 = [], array3 = [];

	//数字位数超过十二位就不读
	if (number.length > 12) {
		return false;
	}

	// number: 123.45
	// numPart: 123
	// digitPart: 45
	if (digitPos == -1) {
		numPart = number;
		digitPart = '';
	} else {
		numPart = number.substr(0, digitPos);
		digitPart = number.substr(digitPos + 1, number.length);
		if (digitPart === '0') {
			digitPart = '';
		}
	}

	if (numPart === '0') {
		sequence.push(0);
		return sequence;
	}

	var numPartLength = numPart.length;
	for (var i=0; i<numPartLength; i++) {
		var digit = numPart.substr(i,1);
		if (numPartLength <= 4) {
			array1.push(digit);
		} else if (numPartLength > 4 && numPartLength <= 8) {
			if (i < numPartLength-4) {
				array2.push(digit);
			} else {
				array1.push(digit);
			}
		} else if (numPartLength > 8 && numPartLength <= 12) {
			if (i < numPartLength-8) {
				array3.push(digit);
			} else if ((i >= numPartLength-8) && (i < numPartLength-4)) {
				array2.push(digit);
			} else {
				array1.push(digit);
			}
		}
	}

	array3 = numberTransform(array3.join(''));
	array2 = numberTransform(array2.join(''));
	array1 = numberTransform(array1.join(''));

	if (array3.length != 0) {
		array3.push('yi');
	}
	if (array2.length != 0) {
		array2.push('wan');
	}
	sequence = array3.concat(array2,array1);

	// digitPartSounds: [4,5]
	if (digitPart) {
		sequence.push('point');
		var digitPartLength = digitPart.length;
		for (var i=0; i<digitPartLength; i++) {
			var digit = digitPart.substr(i,1);
			sequence.push(digit);
		}
	}

	return sequence;
}

/**
 * 获取数字转换的数组
 */
function numberTransform(string) {
	var posSoundMap = {
		1: null, 	// 个
		2: 'shi', 	// 十
		3: 'bai', 	// 百
		4: 'qian', 	// 千
		5: 'wan', 	// 万
		6: 'shi', 	// 十万
		7: 'bai', 	// 百万
		8: 'qian', 	// 千万
		9: 'yi', 	// 亿
		10: 'shi', 	// 十亿
		11: 'bai', 	// 百亿
		12: 'qian', // 千亿
		13: 'zhao', // 兆
	};
	var isLastZero = false;
	var stringLength = string.length;
	var sequence = [];

	// numPartSounds: [1,bai,2,shi,san,null]
	for (var i=0; i<stringLength; i++) {
		var digit = string.substr(i,1);
		if (parseInt(digit) > 0) {
			isLastZero = false;
			sequence.push(digit);
			if (posSoundMap[stringLength - i]) {
				sequence.push(posSoundMap[stringLength - i]);
			}
		} else {
			// 处理末尾的多个连续0
			if (parseInt(string.substr(i)) === 0) {
				break;
			}

			//处理间隔的0
			if (isLastZero) {
				continue;
			} else {
				isLastZero = true;
				sequence.push(digit);
			}
		}
	}
	return sequence;
}

/**
 * 清空结果
 */
function clearResult() {
	ndDisplay.innerText = "0";
	operator = "isempty";
	storage = false;
	isOperatorInputed = false;
	playSound('./sound/clear.mp3');
}

/**
 * 删除一位数字
 */
function deleteNumber() {
	if (ndDisplay.innerText != '0') {
		var str = ndDisplay.innerText;
		ndDisplay.innerText = str.substring(0, str.length - 1);
	}
	playSound('./sound/delete.mp3');
}

/**
 * 改变数字正负
 */
function changeNumber() {
	if (ndDisplay.innerText != '0' || ndDisplay.innerText != '') {
		ndDisplay.innerText = -(ndDisplay.innerText);
	}

	if (ndDisplay.innerText > 0) {
		playSound('./sound/zheng.mp3');
	} else if (ndDisplay.innerText < 0) {
		playSound('./sound/fu.mp3');
	}
}

/**
 * 数学函数
 */
function mathFun(func) {
	switch (func) {
		case 'sin':
			ndDisplay.innerText = Math.sin((ndDisplay.innerText) * Math.PI/180);
			break;
		case 'cos':
			ndDisplay.innerText = Math.cos((ndDisplay.innerText) * Math.PI/180);
			break;
		case 'tan':
			ndDisplay.innerText = Math.tan((ndDisplay.innerText) * Math.PI/180);
			break;
		case 'EXP':
			ndDisplay.innerText = Math.exp(ndDisplay.innerText);
			break;
		case 'log':
			ndDisplay.innerText = Math.log(ndDisplay.innerText);
			break;
		case '%':
			ndDisplay.innerText = parseFloat(ndDisplay.innerText) / 100;
			break;
	}
	ndDisplay.innerText = Math.round((ndDisplay.innerText) * 10000) / 10000;
	storage = true;
}

/**
 * 存储/显示当前值
 */
function localValue(key) {
	switch (key) {
		case 'MS':
			if (ndDisplay.innerText == '0') {
				console.log('没有存储数据');
			} else {
				localvalue = ndDisplay.innerText;
				console.log('存储数据成功');
			}
			break;
		case 'MR':
			if (localvalue) {
				ndDisplay.innerText = localvalue;
				console.log('显示存储数据');
			}
			break;
		case 'M＋':
			if (localvalue) {
				ndDisplay.innerText = parseFloat(localvalue) + parseFloat(ndDisplay.innerText);
				console.log('显示存储数据加上当前值的和');
			}
			break;
	}
}

/**
 * 播放声音
 */
function  playSound(source) {
	if (isPlaySoundInputed == true) {
		ndAudio.setAttribute('src', source);
		ndAudio.setAttribute('autoplay', true);
		ndAudio.addEventListener('ended', function() {
		// console.log('sound: ' + source + ' ended!');
		});
	}
}

/**
 * 声音序列
 */
function SoundSequence(sequence) {
	this.sequence = sequence;
	this.maxSoundIndex = sequence.length - 1;
	this.currentSoundIndex = 0;
	// console.log(this);
}

SoundSequence.prototype.play = function() {
	var that = this;
	var currentSound = 'sound/' + this.sequence[this.currentSoundIndex] + '.mp3';

	// console.log('play sound #' + this.currentSoundIndex + ': ' + currentSound);

	var ndBody = document.querySelector('body');
	var ndAudio = document.createElement('audio');
	ndBody.appendChild(ndAudio);

	ndAudio.setAttribute('src', currentSound);
	ndAudio.setAttribute('autoplay', true);
	ndAudio.addEventListener('ended', function() {
		if (that.currentSoundIndex === that.maxSoundIndex) {
			// console.log('sound sequence end!');
			if (isPlaySoundInputed == true) {
				return false;
			}
		} else {
			that.currentSoundIndex++;
			ndBody.removeChild(ndAudio);
			that.play();
		}
	}, false);
}

SoundSequence.prototype.stop = function() {
	ndBody.removeChild(ndAudio);
}

function changeSoundMode() {
	if (ndSound.checked) {
		isPlaySoundInputed = false; //不发声
	} else {
		isPlaySoundInputed = true; //发声
	}
}