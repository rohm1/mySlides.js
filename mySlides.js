var mySlides = function(userParams) {
	/************* params ******************/
	this.params = {
		lang: 'en',

		footerPageStyle: '%p/%t',
		footerDisplay: true,
		footerAutoHide: true,
		footerShowDuration: 1500,
		footerDisplayTime: 200,
		footerHideTime: 200,
		footerShowMethod: 'slide',
		footerHideMethod: 'slide',
	};

	if(userParams != undefined) {
		for(param in userParams)
			this.params[param] = userParams[param];
	}

	/************* variables ******************/
	this.nbr = -1;
	this.prev = -1;
	this.crt = -1;
	this.hash = -1;

	this.lang = {
		defaultLang: 'en',
		fr: {
			format: '%N %j %F %Y',
			days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
			months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
		},
		en: {
			format: '%N, %F %j %Y',
			days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Décember']
		},
		de: {
			format: '%N, %j. %F %Y',
			days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
			months: ['Januar', 'Februar', 'MMärz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dézember']
		}
	};

	/************* init ******************/
	this.bind('DOMContentLoaded', this.init);
};

mySlides.prototype = {

	/************* events binding ******************/

	bind: function(event, fn, o) {
		$(o == undefined ? document : o).bind(event, {context: this, fn: fn}, this.handleEvent);
	},

	handleEvent: function(e) {
		e.data.fn.call(e.data.context, e);
	},

	keydown: function(e) {
		switch(e.which) {
			case 39: /*right*/
			case 40: /*down*/
			case 32: /*space*/
			case 78: /*n*/
				document.location.hash = this.crt+1;
				e.preventDefault();
				break;
			case 37: /*left*/
			case 38: /*up*/
			case 8: /*back*/
			case 80: /*p*/
				document.location.hash = this.crt-1;
				e.preventDefault();
				break;
			default:
				break;
		}
	},

	/************* init ******************/
	init: function() {
		//set date
		var d = new Date(),
			l = this.lang[this.params.lang] == undefined ? this.lang[this.lang.defaultLang] : this.lang[this.params.lang];
		$('.date').html( l.format.replace('%j', d.getDate()).replace('%N', l.days[d.getDay()]).replace('%F', l.months[d.getMonth()]).replace('%Y', d.getFullYear()) );

		//bind keys
		this.bind('keydown', this.keydown);

		//
		var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
		window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
			var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
			return __nativeSI__(vCallback instanceof Function ? function () {
				vCallback.apply(oThis, aArgs);
			} : vCallback, nDelay);
		};

		//misc
		this.nbr = $('.slide').length;
		setInterval.call(this, this.checkSlide, 20);
	},

	/************* navigation ******************/

	checkSlide: function() {
		if(window.location.hash != this.hash) {
			this.crt = parseInt(document.location.hash.replace('#', ''));
			this.crt = (isNaN(this.crt) || this.crt < 1) ? 1 : (this.crt > this.nbr ? this.nbr : this.crt);
			document.location.hash = this.crt;
			this.hash = document.location.hash;
			$('.slide').hide().eq(this.crt-1).show();
			$('.page').html( this.params.footerPageStyle.replace('%p', this.crt).replace('%t', this.nbr) );
		}
	},

}

