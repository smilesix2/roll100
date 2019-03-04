$(function () {
	// window icon
	fillIcons(10, '.icon-top');
	fillIcons(10, '.icon-bottom');
	fillIcons(5, '.icon-left');
	fillIcons(5, '.icon-right');

	// prize icon
	fillIcons(10, '.icon-top-little', true);
	fillIcons(10, '.icon-bottom-little', true);
	fillIcons(5, '.icon-left-little', true);
	fillIcons(5, '.icon-right-little', true);


	resizeCss();

	$(window).resize(function () {
		resizeCss();
	});

	// fn
	function resizeCss() {
		var viewWidth = $(window).width();
		var viewHeight = $(window).height();
		var paddingTop = 60;
		var contentLeft = 8;
		$('.content').css({
			width: viewWidth - paddingTop * 2,
			height: viewHeight - paddingTop * 2
		});
		var wrapWidth = $('.content').width();
		var wrapHeight = $('.content').height();
		$('.left').css({
			width: wrapWidth * 0.3922,
			height: wrapHeight - contentLeft * 2
		});
		$('.right').css({
			width: wrapWidth * 0.3163,
			height: wrapHeight - contentLeft * 2
		});
		$('.middle').css({
			left: wrapWidth * 0.3922 + contentLeft,
			width: wrapWidth * 0.2915 - contentLeft * 2,
			height: wrapHeight - 12 + paddingTop
		});

		$('.icon-top .icon,.icon-bottom .icon').each(function () {
			$(this).css({
				'margin-left': getGaps(viewWidth, 10, 30) + 'px'
			});
		});

		$('.icon-left .icon,.icon-right .icon').each(function () {
			$(this).css({
				'margin-top': getGaps(viewHeight, 5, 30) + 'px'
			});
		});

		var littleIconWidth = $('.icon-top-little').width();
		var littleIconHeight = $('.icon-left-little').height();
		$('.icon-top-little .icon-little,.icon-bottom-little .icon-little').each(function () {
			$(this).css({
				'margin-left': getGaps(littleIconWidth, 10, 10, true) + 'px'
			});
		});
		$('.icon-left-little .icon-little,.icon-right-little .icon-little').each(function () {
			$(this).css({
				'margin-top': getGaps(littleIconHeight, 5, 10, true) + 'px'
			});
		});

		$('#random,#name').each(function () {
			$(this).css({
				'line-height': $(this).height() + 'px'
			});
		});
		$('#btn,#cancel').each(function () {
			$(this).css({
				'line-height': $(this).height() - 12 + 'px'
			});
		});

		// floor
		$('.floor').css({
			width: $(window).width(),
			height: $(window).height()
		});
		$('.mes-tip').css({
			left: ($(window).width() - $('.mes-tip').width()) / 2,
			top: ($(window).height() - $('.mes-tip').height()) / 2
		})

	}

	function fillIcons(n, select, little) {
		var str = '';
		var littleStr = little ? '-little' : '';
		var flag = select == '.icon-right' + littleStr ? true : false;
		for (var i = 0; i < n; i++) {
			if (i % 2) {
				if (flag) {
					str = str + '<div class="icon' + littleStr + '"></div>';
				} else {
					str = str + '<div class="icon' + littleStr + ' light' + littleStr + '"></div>';
				}
			} else {
				if (flag) {
					str = str + '<div class="icon' + littleStr + ' light' + littleStr + '"></div>';
				} else {
					str = str + '<div class="icon' + littleStr + '"></div>';
				}
			}
		}
		$(select).append(str);
	}

	// get better gaps
	function getGaps(width, num, d, little) {
		var left = 0;
		if (little) {
			left = (width - num * d) / (num + 1);
		} else {
			left = (width - d * 3 - num * d) / (num + 1);
		}
		return left;
	}

	// set nums  
	// window icons
	// .icon-left-top    0
	$('.icon-left-top').attr('data-icon', 0);
	// .icon-top   .icon   1-10
	$('.icon-top .icon').each(function () {
		$(this).attr('data-icon', $(this).index() + 1);
	});
	// .icon-right-top     11
	$('.icon-right-top').attr('data-icon', 11);
	// .icon-right .icon    12-16
	$('.icon-right .icon').each(function () {
		$(this).attr('data-icon', $(this).index() + 12);
	});
	// .icon-right-bottom   17
	$('.icon-right-bottom').attr('data-icon', 17);
	// .icon-bottom  18 - 27
	$('.icon-bottom .icon').each(function () {
		$(this).attr('data-icon', 10 - $(this).index() + 17);
	});
	// icon-left-bottom    28
	$('.icon-left-bottom').attr('data-icon', 28);
	// icon-left   29 - 33
	$('.icon-left  .icon').each(function () {
		$(this).attr('data-icon', 5 - $(this).index() + 28);
	});

	// middle-content   icons
	// icon-top-little  0 - 9
	$('.icon-top-little .icon-little').each(function () {
		$(this).attr('data-icon-little', $(this).index());
	});
	// icon-right-little  10 - 14
	$('.icon-right-little .icon-little').each(function () {
		$(this).attr('data-icon-little', $(this).index() + 10);
	});
	// icon-bottom-little  15-24
	$('.icon-bottom-little .icon-little').each(function () {
		$(this).attr('data-icon-little', 10 - $(this).index() + 14);
	});
	// icon-left-little  25 - 29
	$('.icon-left-little .icon-little').each(function () {
		$(this).attr('data-icon-little', 5 - $(this).index() + 24);
	});


	// set init light
	$('.icon-wrap .icon').each(function () {
		if ($(this).hasClass('light')) {
			$(this).attr('init-light', true);
		}
	});
	$('.middle-content .icon-little').each(function () {
		if ($(this).hasClass('light-little')) {
			$(this).attr('init-light-little', true);
		}
	});

})