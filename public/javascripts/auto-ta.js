var autota = function () {
	//'private' variables
	var ta = null;
	var comp = null;
	var corners = null;
	var modTop = null;
	var modBttm = null;

	var borderRad = null;
	var borderTop = null;
	var borderBttm = null;
	var padTop = null;
	var padBttm = null;
	var tare = null;

	var scrollLeft = null;
	var scrollTop = null;

	//initialize on instance
	setup.apply(this, arguments);


	//'private' functions
	function setIndex(num) {
		num = parseFloat(num);
		num = fixNan(num);
		num = num.toString();
		ta.style.zIndex = num;

		return num;
	};


	function cancelCorners() {
		if(modTop) {
			ta.style.borderTopRightRadius = borderRad + "px";
		}

		if(modBttm) {
			ta.style.borderBottomRightRadius = borderRad + "px";
		}
	};


	function styleCorners() {
		if(modTop) {
			ta.style.borderTopRightRadius = "0px";
		}

		if(modBttm) {
			ta.style.borderBottomRightRadius = "0px";
		}
	};


	function setCorners() {
		borderRad = parseFloat(comp.getPropertyValue('border-top-left-radius'));
		borderRad = fixNan(borderRad);

		modTop = (borderTop < borderRad) ? true : false;
		modBttm = (borderBttm < borderRad) ? true : false;
	};


	function scrollbar() {
		if(ta.clientHeight !== ta.scrollHeight) {
			if(ta.style.overflowY !== 'scroll') {
				if(corners) {
					styleCorners();
				}

				ta.style.overflowY = 'scroll';
			}
		}else if(ta.style.overflowY === 'scroll') {
			ta.style.overflowY = 'hidden';
			if(corners) {
				cancelCorners();
			}
		}
	};


	function size() {
		scrollLeft = window.pageXOffset;
		scrollTop = window.pageYOffset;

		if(ta.scrollHeight <= ta.clientHeight) {
			ta.style.height = 'auto';
		}

		ta.style.height = ta.scrollHeight + tare + 'px';

		scrollbar();
		window.scrollTo(scrollLeft, scrollTop);
	};


	function onResize() {
		getTare();

		if(corners && ta.style.overflowY !== 'scroll') {
			cancelCorners();
		}

		size();
	};


	function addEvents() {
		window.addEventListener('resize', onResize, false);
		ta.addEventListener('input', size, false);
	};


	function removeEvents() {
		window.removeEventListener('resize', onResize, false);
		ta.removeEventListener('input', size, false);
	};


	function fixNan(obj) {
		if(isNaN(obj)) {
			return 0;
		}

		return obj;
	};


	function setTare() {
		borderTop = parseFloat(comp.getPropertyValue('border-top-width'));
		borderBttm = parseFloat(comp.getPropertyValue('border-bottom-width'));
		padTop = parseFloat(comp.getPropertyValue('padding-top'));
		padBttm = parseFloat(comp.getPropertyValue('padding-bottom'));

		borderTop = fixNan(borderTop);
		borderBttm = fixNan(borderBttm);
		padTop = fixNan(padTop);
		padBttm = fixNan(padBttm);
	};


	function getTare() {
		setTare();
		setCorners();

		if(comp.getPropertyValue('box-sizing') === 'border-box') {
			tare = borderTop + borderBttm;
		}else{
			tare = (padTop + padBttm) * -1;
		}
	};


	function modCorners(bool) {
		if(corners && !bool) {
			cancelCorners();
		}

		if(typeof bool === 'boolean') {
			corners = bool;
		}
	};


	function styleTa() {
		ta.style.overflow = 'hidden';
		ta.style.overflowX = 'hidden';
		ta.style.overflowY = 'hidden';
		ta.style.wordWrap = 'break-word';
		ta.style.position = 'relative';
	};


	function cleanUp() {
		if(ta !== null) {
			removeEvents(ta);
			comp = null;
			corners = null;
			ta = null;
		}
	};


	function isTa(node) {
		return node.tagName === 'TEXTAREA';
	};


	function setup() {
		if(!arguments.length) {
			return;
		}

		if(isTa(arguments[0])) {
			cleanUp();

			ta = arguments[0];
			comp = window.getComputedStyle(ta, null);

			styleTa();

			if(arguments[1] === false) {
				modCorners(arguments[1]);
			}else{
				modCorners(true);
			}

			getTare();
			addEvents();
			size();
		}
	};


	return {
		//'interface'
		init: function() {
			setup.apply(this, arguments);
		},

		corners: function(bool) {
			modCorners(bool);
		},

		getComp: function() {
			return comp;
		},

		getText: function() {
			return ta.value;
		},

		setZ: function(num) {
			return setIndex(num);
		},

		destroy: function() {
			cleanUp();
		},
	};
}
