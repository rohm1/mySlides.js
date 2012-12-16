var mySlides = function(userParams) {
	/************* params ******************/
	this.params = {
		lang: 'en',

		tocLevel: 2,

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
	this.hash = -1;
	this.ntrans = 0;
	this.curTrans = 0;

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
				if(this.curTrans == this.ntrans || this.ntrans == 0)
					document.location.hash = this.crt+1;
				else
					this.doTrans(1);
				break;
			case 37: /*left*/
			case 38: /*up*/
			case 8: /*back*/
			case 80: /*p*/
				if(this.curTrans == 0  || this.ntrans == 0)
					document.location.hash = this.crt-1;
				else
					this.doTrans(-1);
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
		this.toc();
		this.nbr = $('.slide').length;
		this.setInterval(this.checkSlide, 20);
	},

	setInterval: function(vCallback, nDelay) {
		var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
		return window.setInterval(vCallback instanceof Function ? function () {
			vCallback.apply(oThis, aArgs);
		} : vCallback, nDelay);
	},

	/************* toc ******************/

	toc: function() {
		var root = $('<ul />');
		var t = this;
		$('.section').each(function() {
			var li = t.mkTocLi($(this));
			if(t.params.tocLevel == 2) {
				var childs = $('<ul />');
				$(this).nextAll('.section, .subsection').each(function() {
					if($(this).hasClass('section'))
						return false;
					childs.append(t.mkTocLi($(this)));
				});
				if(childs.find('li').length != 0)
					li.append( childs );
			}
			root.append(li);
		});

		$('.toc').append(root);
	},

	mkTocLi: function(elt) {
		var a = $('<a />')
			.html(elt.find('.title').html())
			.attr('href', '#' + (elt.parent().find('.slide').index(elt) + 1));
		return $('<li />').append(a);
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

			this.ntrans = $('.slide').eq(this.crt-1).find('.pause').length;
			this.curTrans = -1;
			this.doTrans(1);
		}
	},

	doTrans: function(trans) {
		this.curTrans += trans;
		$('.slide').eq(this.crt-1).find('.body').children().hide();
		if(this.curTrans == this.ntrans)
			$('.slide').eq(this.crt-1).find('.body').children().show();
		else
			$('.slide').eq(this.crt-1).find('.pause').eq(this.curTrans).prevAll().show();
	},

}

