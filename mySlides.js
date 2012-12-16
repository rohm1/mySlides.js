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
	this.crt = -1;
	this.popstate = -1;

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
				this.crt = this.crt + 1;
				this.checkSlide();
				e.preventDefault();
				break;
			case 37: /*left*/
			case 38: /*up*/
			case 8: /*back*/
			case 80: /*p*/
				this.crt = this.crt - 1;
				this.checkSlide();
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

		//misc
		this.nbr = $('.slide').length;
		this.crt = parseInt(document.location.hash.replace('#', ''));
		this.checkSlide();
	},

	/************* navigation ******************/

	pushState: function(url) {
		history.pushState({}, '', '#' + url);
		this.loadSlide();
	},

	checkSlide: function() {
		if(history.state != this.popstate) {
			this.crt = (isNaN(this.crt) || this.crt < 1) ? 1 : (this.crt > this.nbr ? this.nbr : this.crt);
			this.pushState(this.crt);
		}
	},

	loadSlide: function() {
		$('.slide').hide().eq(this.crt-1).show();
		$('.page').html( this.params.footerPageStyle.replace('%p', this.crt).replace('%t', this.nbr) );
	},
}

