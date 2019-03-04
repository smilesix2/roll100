// config
var prizeConfig = {
	'prize1': {
		'name': '一等奖',
		'num': '1'
	},
	'prize2': {
		'name': '二等奖',
		'num': '2'
	},
	'prize3': {
		'name': '三等奖',
		'num': '5'
	},
	'prize4': {
		'name': '四等奖',
		'num': '8'
	},
	'prize5': {
		'name': '五等奖',
		'num': '10'
	}
};

// localStorage data
var localData = {
	type: 'prize5',
	num: 10,
	rest: 150,
	random: '1',
	peopleArr: [],
	selected: [],
	list: {
		prize1: [],
		prize2: [],
		prize3: [],
		prize4: [],
		prize5: []
	}
};

// data handle
var people = getPeople(names),
	peopleObj = people.obj,
	peopleNum = people.num;
var timer = null;

// namesNo 
peopleNum = deleteArr(peopleNum, namesNo);


// init num  one time
var prizeSum = 0;
var gapArr = (function (prizeConfig) {
	var arr = [],
		gap5 = prizeConfig['prize5']['num'] - 0,
		gap4 = prizeConfig['prize4']['num'] - 0,
		gap3 = prizeConfig['prize3']['num'] - 0,
		gap2 = prizeConfig['prize2']['num'] - 0,
		gap1 = prizeConfig['prize1']['num'] - 0;
	arr.push(gap5);
	arr.push(gap5 + gap4);
	arr.push(gap5 + gap4 + gap3);
	arr.push(gap5 + gap4 + gap3 + gap2);
	prizeSum = arr[3] + gap1;
	return arr;
}(prizeConfig));

$('#type').text(prizeConfig['prize5']['name']);
$('#num').text(prizeConfig['prize5']['num']);
$('#rest').text(peopleNum.length);
$('#random').text(peopleNum[0]);
$('#name').text(names[0]);

initPrizeList(prizeConfig, '.right > ul');
fill(peopleNum, divStr, '#people');

// if localData exist
var localDataSave = JSON.parse(localStorage.getItem('yyPrize'));
if (localDataSave) {
	// change
	// people  data  :    peopleArr     selected
	peopleNum = localDataSave.peopleArr;
	var lucker = localDataSave.selected;

	// left 
	$('#people div').each(function () {
		var text = $(this).text();
		if ($.inArray(text, peopleNum) >= 0 || $.inArray(text, lucker) >= 0) {
			if ($.inArray(text, lucker) >= 0) {
				$(this).addClass('peopleGet');
			}
		} else {
			$(this).remove();
		}
	});

	// middle
	$('#type').removeClass().addClass(localDataSave.type).text(prizeConfig[localDataSave.type]['name']);
	$('#num').text(localDataSave.num);
	$('#rest').text(localDataSave.rest);
	$('#random').text(localDataSave.random);
	$('#name').text(peopleObj[localDataSave.random]);

	// right 
	setUnitList(localDataSave.list);

	resizeHeight();
	setTimeout(function () {
		resizeHeight();
	}, 1000);

}

// namesBlack
var rollPeople = deleteArr(peopleNum, namesBlack);
$('#rest').text(peopleNum.length);

// handle
$('.right').on('click', 'div', function () {
	if ($(this).parents('li').parents('li').prev('li').find('div').length == 0) {
		$(this).toggleClass('cancel');
	} else {
		// alert('当前奖项已抽完');
	}
});

// animateTimer
var animateTimer = null;
var lock = false;

$('#btn').click(function () {
	selectBtn();
});

$(document).keyup(function (event) {
	if (event.keyCode == 13) {
		if ($('.floor').css('display') == 'none') {
			selectBtn();
		} else {
			floorBtn();
		}
	}
});


$('#cancel').mousedown(function () {
	$(this).addClass('btn-act');
}).mouseup(function () {
	$(this).removeClass('btn-act');
}).click(function () {
	var dels = $('.right').find('.cancel');
	if (dels.length == 0) {
		// alert('请至少选择一个取消号码');
		return;
	}

	dels.each(function () {
		var text = $(this).text();
		$('.peopleGet').each(function () {
			if ($(this).text() == text) {
				$(this).remove();
			}
		});


	});
	dels.remove();

	$('#rest').text(peopleNum.length);

	var type = judgeType('.right');
	$('#type').removeClass().addClass(type).text(prizeConfig[type]['name']);
	var numAct = prizeConfig[type]['num'] - $('#' + type).find('div').length;
	$('#num').text(numAct);


	resizeHeight();
	setlocalStorage();

});

// floor
var floorLock = false;
$('.mes-btn').mousedown(function () {
	$(this).addClass('floor-down');
}).mouseup(function () {
	$(this).removeClass('floor-down');
}).click(function () {
	floorBtn();
});

window.onbeforeunload = function (e) {
	var e = window.event || e;
	e.returnValue = ("确定离开当前页面吗？");
}

// icon  timer
var iconTimer = null;

function selectBtn() {
	if (lock) {
		return;
	}
	clearInterval(animateTimer);
	animateTimer = null;

	if ($('#btn').hasClass('start')) {
		$('.wrap').addClass('active');
		$('#btn').addClass('btn-act');
		iconStart();

		lock = true;
		setTimeout(function () {
			lock = false;
		}, 800);

		if ($('.right').find('div').length >= prizeSum) {
			// alert('奖品已全部抽完');
			$('.wrap').removeClass('active');
			iconEnd();
			return;
		}

		// mp3  roll
		// $('#luck')[0].pause();
		// $('#luck')[0].load();
		// $('#roll')[0].play();

		// start		
		rollPeople = radomArr(rollPeople);
		timer = setInterval(function () {
			rollHtml(rollPeople);
		}, 80);

		$('#btn').removeClass('start').text('停止');
		$('.shake').addClass('work');

		animateTimer = setInterval(function () {
			$('.shake').toggleClass('work');
		}, 1500);


	} else {
		$('.wrap').removeClass('active');
		$('#btn').removeClass('btn-act');
		iconEnd();

		// end		
		clearInterval(timer);
		timer = null;
		$('#btn').addClass('start').text('现在开奖');
		$('.shake').removeClass('work');

		clearInterval(animateTimer);
		animateTimer = null;

		// change		
		xalert('', $('#random').text(), $('#name').text());


		// mp3  luck
		// $('#roll')[0].pause();
		// $('#roll')[0].load();
		// $('#luck')[0].play();

		lock = false;
	}
}

function floorBtn() {
	if (floorLock) {
		return;
	}
	$('.floor').css({
		display: 'none',
		opacity: 0
	});
	$('.mes-tip').removeClass('layui-m-anim-scale').addClass('layui-m-anim-scale-little');
	$('.star-light').css('display', 'none');

	// setTimeout(function () {
	judgeHtml();
	// }, 200);

	// mp3  end
	// $('#roll')[0].pause();
	// $('#roll')[0].load();
	// $('#luck')[0].pause();
	// $('#luck')[0].load();
}

function iconStart() {
	var iconIndex = 0;
	var iconLittleIndex = 0;
	iconTimer = setInterval(function () {
		// window icons
		$('.icon-wrap .icon').removeClass('light');
		if (iconIndex == 34) {
			iconIndex = 0;
		}
		$('[data-icon="' + iconIndex + '"]').addClass('light');

		var iconIndex1 = iconIndex + 1 == 34 ? 0 : iconIndex + 1;
		var iconIndex2 = iconIndex + 2 == 34 ? 0 : iconIndex + 2;
		var iconIndex3 = iconIndex + 3 == 34 ? 0 : iconIndex + 3;
		var iconIndex4 = iconIndex + 4 == 34 ? 0 : iconIndex + 4;
		$('[data-icon="' + iconIndex1 + '"]').addClass('light');
		$('[data-icon="' + iconIndex2 + '"]').addClass('light');
		$('[data-icon="' + iconIndex3 + '"]').addClass('light');
		$('[data-icon="' + iconIndex4 + '"]').addClass('light');
		
		iconIndex++;

		// middle icons
		$('.middle-content .icon-little').removeClass('light-little');
		if (iconLittleIndex == 30) {
			iconLittleIndex = 0;
		}
		$('[data-icon-little="' + iconLittleIndex + '"]').addClass('light-little');
		var iconLittleIndex1 = iconLittleIndex + 1 == 30 ? 0 : iconLittleIndex + 1;
		var iconLittleIndex2 = iconLittleIndex + 2 == 30 ? 0 : iconLittleIndex + 2;
		$('[data-icon-little="' + iconLittleIndex1 + '"]').addClass('light-little');
		$('[data-icon-little="' + iconLittleIndex2 + '"]').addClass('light-little');
		iconLittleIndex++;
	}, 30);
}

function iconEnd() {
	clearInterval(iconTimer);
	iconTimer = null;
	$('.icon-wrap .icon').removeClass('light');
	$('.icon-wrap .icon').each(function () {
		if ($(this).attr('init-light')) {
			$(this).addClass('light');
		}
	});

	$('.middle-content .icon-little').removeClass('light-little');
	$('.middle-content .icon-little').each(function () {
		if ($(this).attr('init-light-little')) {
			$(this).addClass('light-little');
		}
	});
}


// fn
// localStorage set data
function setlocalStorage() {
	// middle
	localData.type = $('#type')[0].className;
	localData.num = $('#num').text();
	localData.rest = $('#rest').text();
	localData.random = $('#random').text();
	localData.peopleArr = peopleNum;
	localData.selected = (function () {
		var arr = [];
		$('.right div').each(function () {
			arr.push($(this).text());
		});
		return arr;
	}());
	// right
	getUnitList(localData.list);
	// console.log(localData.list);
	// sum
	localStorage.setItem('yyPrize', JSON.stringify(localData));
}

// localStorage get html
function getUnitList(obj) {
	for (var select in obj) {
		var prizeWrap = $('#' + select + ' div');
		var prizeArr = [];
		if (prizeWrap.length > 0) {
			prizeWrap.each(function () {
				prizeArr.push($(this).text());
			});
		}
		obj[select] = prizeArr;
	}
}

// localStorage set  html
function setUnitList(obj) {
	for (var i in obj) {
		var prizeUnit = obj[i];
		var prizeUnitLen = prizeUnit.length;
		if (prizeUnitLen > 0) {
			var strUnit = '';
			for (var m = 0; m < prizeUnitLen; m++) {
				strUnit = strUnit + '<div>' + prizeUnit[m] + '</div>';
			}
			$('#' + i).append(strUnit);
		}
	}
}

// init people obj
function getPeople(arr) {
	var obj = {};
	var num = [];
	for (var i = 1, j = arr.length + 1; i < j; i++) {
		obj[addZero(i)] = arr[i - 1];
		num.push(addZero(i));
	}
	return {
		obj: obj,
		num: num
	};
}

function judgeType(select) {
	var classStr = 'prize';
	var eles = $(select).find('div').length;
	if (eles < gapArr[0]) {
		classStr += '5';
	} else if (eles >= gapArr[0] && eles < gapArr[1]) {
		classStr += '4';
	} else if (eles >= gapArr[1] && eles < gapArr[2]) {
		classStr += '3';
	} else if (eles >= gapArr[2] && eles < gapArr[3]) {
		classStr += '2';
	} else if (eles >= gapArr[3]) {
		classStr += '1';
	}
	return classStr;
}

function judgeHtml() {
	var actType = judgeType('.right');
	var randomStr = $('#random').text();

	// diff data
	rollPeople = removeOne(rollPeople, randomStr);
	peopleNum = removeOne(peopleNum, randomStr);
	$('#rest').text(peopleNum.length);

	$('#' + actType).append('<div>' + randomStr + '</div>')
	$('#type').removeClass().addClass(actType).text(prizeConfig[actType]['name']);
	$('#people').find('div').each(function () {
		if ($(this).text() == randomStr) {
			$(this).addClass('peopleGet');
		}
	});

	var numAct = prizeConfig[actType]['num'] - $('#' + actType).find('div').length;
	if (numAct <= 0 && actType == 'prize1') {
		numAct = 0;
		$('#num').text(numAct);
		setlocalStorage();
		return;
	}
	$('#num').text(numAct);

	// changeType
	if (numAct == 0) {
		var changeType = actType.slice(0, -1) + (actType.substr(-1) - 1);
		$('#num').text(prizeConfig[changeType]['num']);
		$('#type').removeClass().addClass(changeType).text(prizeConfig[changeType]['name']);
	}
	$('.right div').removeClass('cancel');
	resizeHeight();

	//set     localStorage  yyPrize && localData     JSON.stringify()    JSON.parse()
	setlocalStorage();

	floorLock = true;
}


function resizeHeight() {
	$('#prize1,#prize2,#prize3,#prize4,#prize5').each(function () {
		if ($(this)[0].scrollHeight > $(this).prev('li').height()) {
			$(this).css({
				'line-height': '50px'
			}).parent().css('padding', '20px 0');
		} else {
			$(this).css({
				'line-height': '100px'
			}).parent().css('padding', '0');
		}
		// low screen
		if ($(window).width() < 1440) {
			if ($(this)[0].scrollHeight > $(this).prev('li').height()) {
				$(this).css({
					'line-height': '50px'
				}).parent().css('padding', '10px 0');
			} else {
				$(this).css({
					'line-height': '50px'
				}).parent().css('padding', '0');
			}
		}

	});
}


// data to html
function rollHtml(arr) {
	var len = arr.length;
	var ran = Math.floor(len * Math.random());
	var ranEle = arr[ran];
	$('#random').text(ranEle);
	$('#name').text(peopleObj[ranEle]);
	$('#people').find('div').each(function () {
		if ($(this).text() == ranEle) {
			$(this).addClass('peopleAct');
		} else {
			$(this).removeClass('peopleAct');
		}
	});
}

// remove one ele
function removeOne(arr, ele) {
	var arrOut = [];
	var lens = arr.length;
	if (lens === 0) {
		return [];
	};
	for (var k = 0; k < lens; k++) {
		if (arr[k] != ele) {
			arrOut.push(arr[k]);
		}
	}
	return arrOut;
}

// str add
function divStr(arr) {
	if (arr.length === 0) {
		return '';
	}
	var str = '';
	$.each(arr, function (i, v) {
		str += '<div>' + v + '</div>';
	});
	return str;
}

function fill(arr, handle, container) {
	$(container).html(handle(arr));
}

function initPrizeList(obj, select) {
	var str = '';
	$.each(obj, function (i, v) {
		str = str + '<li><ul class="clear-float">' +
			'<li>' + v['name'] + '</li>' +
			'<li>' + v['num'] + '名' + '</li>' +
			'<li id="' + i + '" class="clear-float"></li>' +
			'</ul><span class="gaps"></span></li>';
	});
	$(select).append(str);
}

// alert UI
function xalert(str, num, name) {
	// $('.mes-con').text(str);
	if (num) {
		$('.mes-num').text(num);
		$('.mes-name').text(name);
	}
	$('.floor').css({
		display: 'block',
		width: $(window).width(),
		height: $(window).height()
	}).animate({
		opacity: 1
	}, 250);
	$('.star-light').css({
		display: 'block',
		left: ($(window).width() - $('.star-light').width()) / 2,
		top: ($(window).height() - $('.star-light').height()) / 2 - 40
	}).addClass('star-light-scale');
	$('.mes-tip').css({
		display: 'block',
		left: ($(window).width() - $('.mes-tip').width()) / 2,
		top: ($(window).height() - $('.mes-tip').height()) / 2 - 40
	}).removeClass('layui-m-anim-scale-little').addClass('layui-m-anim-scale');

	floorLock = false;
}

function addZero(i) {
	var str = '';
	var numer = i - 0;
	if (numer < 10) {
		str = '00' + numer;
	} else if (numer >= 10 && numer < 100) {
		str = '0' + numer;
	} else {
		str = '' + numer;
	}
	return str;
}

function radomArr(array) {
	var copy = [],
		n = array.length,
		i;
	while (n) {
		i = Math.floor(Math.random() * array.length);
		if (i in array) {
			copy.push(array[i]);
			delete array[i];
			n--;
		}
	}
	return copy;
}