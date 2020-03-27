function AutoTaObj() {
	this.ta = null;
	this.comp = null;
	this.corners = null;
	this.modTop = null;
	this.modBttm = null;

	this.borderRad = null;
	this.borderTop = null;
	this.borderBttm = null;
	this.padTop = null;
	this.padBttm = null;
	this.tare = null;

	this.scrollLeft = null;
	this.scrollTop = null;

	this.setup.apply(this, arguments);
}


AutoTaObj.prototype.setIndex = function(num) {
	num = parseFloat(num);
	num = this.fixNan(num);
	num = num.toString();
	this.ta.style.zIndex = num;

	return num;
}


AutoTaObj.prototype.cancelCorners = function() {
	if(this.modTop) {
		this.ta.style.borderTopRightRadius = this.borderRad + "px";
	}

	if(this.modBttm) {
		this.ta.style.borderBottomRightRadius = this.borderRad + "px";
	}
}


AutoTaObj.prototype.styleCorners = function() {
	if(this.modTop) {
		this.ta.style.borderTopRightRadius = "0px";
	}

	if(this.modBttm) {
		this.ta.style.borderBottomRightRadius = "0px";
	}
}


AutoTaObj.prototype.scrollbar = function() {
	if(this.ta.clientHeight !== this.ta.scrollHeight) {
		if(this.ta.style.overflowY !== 'scroll') {
			if(this.corners) {
				this.styleCorners();
			}

			this.ta.style.overflowY = 'scroll';
		}
	}else if(this.ta.style.overflowY === 'scroll') {
		this.ta.style.overflowY = 'hidden';

		if(this.corners) {
			this.cancelCorners();
		}
	}
}


AutoTaObj.prototype.size = function() {
	this.scrollLeft = window.pageXOffset;
	this.scrollTop = window.pageYOffset;

	if(this.ta.scrollHeight <= this.ta.scrollHeight) {
		this.ta.style.height = 'auto';
	}

	this.ta.style.height = this.ta.scrollHeight + this.tare + "px";

	this.scrollbar();
	window.scrollTo(this.scrollLeft, this.scrollTop);
}


AutoTaObj.prototype.onResize = function() {
	this.getTare();

	if(this.corners && this.ta.style.overflowY !== 'scroll') {
		this.setCorners();
	}

	this.size();
}


AutoTaObj.prototype.addEvents = function() {
	window.addEventListener('resize', this.onResize.bind(this), false);
	this.ta.addEventListener('input', this.size.bind(this), false);
}


AutoTaObj.prototype.removeEvents = function(node) {
	window.removeEventListener('resize', this.onResize, false);
	this.ta.removeEventListener('input', this.size, false);
}


AutoTaObj.prototype.fixNan = function(obj) {
	if(isNaN(obj)) {
		return 0;
	}

	return obj;
}


AutoTaObj.prototype.setCorners = function() {
	this.borderRad = parseFloat(this.comp.getPropertyValue('border-top-left-radius'));

	this.borderRad = this.fixNan(this.borderRad);

	this.modTop = (this.borderTop < this.borderRad) ? true : false;
	this.modBttm = (this.borderBttm < this.borderRad) ? true : false;
}


AutoTaObj.prototype.setTare = function() {
	this.borderTop = parseFloat(this.comp.getPropertyValue('border-top-width'));
	this.borderBttm = parseFloat(this.comp.getPropertyValue('border-bottom-width'));
	this.padTop = parseFloat(this.comp.getPropertyValue('padding-top'));
	this.padBttm = parseFloat(this.comp.getPropertyValue('padding-bottom'));

	this.borderTop = this.fixNan(this.borderTop);
	this.borderBttm = this.fixNan(this.borderBttm);
	this.padTop = this.fixNan(this.padTop);
	this.padBttm = this.fixNan(this.padBttm);
}


AutoTaObj.prototype.getTare = function() {
	this.setTare();
	this.setCorners();

	if(this.comp.getPropertyValue('box-sizing') === 'border-box') {
		this.tare = this.borderTop + this.borderBttm;
	}else{
		this.tare = (this.padTop + this.padBttm) * -1;
	}
}


AutoTaObj.prototype.modCorners = function(bool) {
	if(this.corners && !bool) {
		this.cancelCorners();
	}

	if(typeof bool === 'boolean') {
		this.corners = bool;
	}
}


AutoTaObj.prototype.styleTa = function() {
	this.ta.style.overflow = 'hidden';
	this.ta.style.overflowX = 'hidden';
	this.ta.style.overflowY = 'hidden';
	this.ta.style.wordWrap = 'break-word';
	this.ta.style.position = 'relative';
}


AutoTaObj.prototype.cleanUp = function(node) {
	if(this.ta !== null) {
		this.removeEvents(this.ta);
		this.comp = null;
		this.ta = null;
	}
}


AutoTaObj.prototype.isTa = function(node) {
	return node.tagName === 'TEXTAREA';
}


AutoTaObj.prototype.setup = function() {
	if(!arguments.length) {
		return;
	}

	if(this.isTa(arguments[0])) {
		this.cleanUp();

		this.ta = arguments[0];
		this.comp = window.getComputedStyle(this.ta, null);

		this.styleTa();

		if(arguments[1] === false) {
			this.modCorners(arguments[1]);
		}else{
			this.modCorners(true);
		}

		this.getTare();
		this.addEvents();
		this.size();
	}
}



//'interface' for AutoTaObj()
function AutoTa() {
	var ata = new AutoTaObj();

	//instantiate
	ata.setup.apply(ata, arguments);


	return {
		init: function() {
			ata.setup.apply(ata, arguments);
		},

		corners: function(bool) {
			ata.modCorners(bool);
		},

		getComp: function() {
			return ata.comp;
		},

		getText: function() {
			return ata.ta.value;
		},

		setZ: function(num) {
			ata.setIndex(num);
		},

		destroy: function() {
			ata.cleanUp();
		},
	}
}
