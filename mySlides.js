var mySlides = function(userParams) {
	/************* params ******************/
	this.params = {
		lang: 'en',
		tocLevel: 2,
		navPopupAsContextMenu: true,
		exposeMode: 'grid',
		slideNumberStyle: '%p/%t',
		footerDisplay: true,
		footerAutoHide: true,
		footerShowDuration: 1500,
		footerDisplayTime: 200,
		footerHideTime: 200,
		footerShowMethod: 'slide',
		footerHideMethod: 'slide',
	};

	if(userParams != undefined) { //params validity is not checked; you submit shit, shit happens!
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
		defaultLang: 'en', //if the submitted parans.lang does not exist
		fr: {
			format: '%l %j %F %Y ',
			days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
			months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
		},
		en: {
			format: '%l, %F %j %Y',
			days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		},
		de: {
			format: '%l, %j. %F %Y',
			days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
			months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
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
				if(this.curTrans == 0)
					document.location.hash = this.crt-1;
				else
					this.doTrans(-1);
				break;
			default:
				break;
		}
	},

	resize: function() {
		var p = $(window).height() / 1000;
		var lh = 3 * p;
		lh = lh < 1.8 ? 1.8 : lh;
		var fs = 130 * p;
		fs = fs < 100 ? 100 : fs;
		$('body').css({'line-height': lh + 'em', 'font-size': fs + '%'});

		if($('.exposeInline .expose').length != 0)
			this.expandInlineExpose();

		if($('.navPopupContextMenu').is(':visible'))
			this.positionContextNav();

		this.scaleImages();
	},

	scaleImages: function() {
		$('#slides .slide img:visible').each(function() {
			if($(this).data('height') == undefined)
				$(this).data('height', $(this).height());
			$(this).height($(this).data('height') * $(window).height() / 1000);
		});
	},

	/************* init ******************/

	init: function() {
		//set date
		var d = new Date(),
			l = this.lang[this.params.lang] == undefined ? this.lang[this.lang.defaultLang] : this.lang[this.params.lang],
			format = this.params.dateFormat == undefined ? l.format : this.params.dateFormat;
		$('.date').html( format.replace('%j', d.getDate()).replace('%l', l.days[d.getDay()]).replace('%F', l.months[d.getMonth()]).replace('%Y', d.getFullYear()).replace('%n', d.getMonth()+1).replace('%y', d.getFullYear()%100) );

		//bind keys
		this.bind('keydown', this.keydown);

		//nav
		this.hideNav();
		this.toc();
		this.bind('click', this.showNav, $('#navButton'));
		this.bind('click', this.hideNav, $('#navPopup a, #navPopupClose'));
		this.bind('submit', this.navSubmit, $('#navForm'));
		$('#navPopup').addClass(this.params.navPopupAsContextMenu ? 'navPopupContextMenu' : 'navPopupPopup');

		//window resize
		this.bind('resize', this.resize, window);
		this.resize();

		//exposé
		this.hideExpose();
		this.bind('click', this.expose, $('#exposeButton'));
		this.bind('click', this.hideExpose, $('#exposeClose'));
		$('#expose').addClass(this.params.exposeMode == 'inline' ? 'exposeInline' : 'exposeGrid');

		//go!
		this.nbr = $('.slide').length;
		this.setInterval(this.checkSlide, 20);
		$('#loader').remove();
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
			$('.slide').removeClass('crt').eq(this.crt-1).addClass('crt');
			$('#pages').html( this.params.slideNumberStyle.replace('%p', this.crt).replace('%t', this.nbr) );

			this.ntrans = $('.slide').eq(this.crt-1).find('.pause').length;
			this.curTrans = -1;
			this.doTrans(1);
		}
	},

	doTrans: function(trans) {
		this.curTrans += trans;
		$('.slide').eq(this.crt-1).find('.body').children().hide();
		var elts;
		if(this.curTrans == this.ntrans)
			elts = $('.slide').eq(this.crt-1).find('.body').children();
		else
			elts = $('.slide').eq(this.crt-1).find('.pause').eq(this.curTrans).prevAll();

		elts.show();
		this.scaleImages();
	},

	showNav: function(e) {
		if(!$('#navPopup').is(':visible')) {
			if(this.params.navPopupAsContextMenu)
				this.positionContextNav();
			$('#navPopup').show();
		}
		else
			this.hideNav();
	},

	positionContextNav: function() {
		$('#navPopup').css({top: $('#navButton').offset().top - $('#navPopup').height(), left: $('#navButton').offset().left + $('#navButton').width() + parseInt($('#navButton').css('margin-right')) - $('#navPopup').width()});
	},

	hideNav: function() {
		$('#navPopup').hide();
	},

	navSubmit: function() {
		document.location.hash = $('#navForm input').eq(0).val();
		this.hideNav();
	},

	expose: function() {
		$('#slides .slide').each(function() {
			$('#exposeSlideContainer').append( $('<span />').attr('id', 'lnk_#' + ($('#slides .slide').index($(this))+1)).append( $(this).clone().addClass('expose') ) );
		});
		this.bind('click', this.exposeClick, $('.expose'));
		$('#expose .slide *').attr('style', '');
		if(this.params.exposeMode == 'inline')
			this.expandInlineExpose();
		$('#expose').show();

		$('#expose .slide img').each(function() {
			if($(this).data('height') == undefined)
				$(this).data('height', $(this).height());
			$(this).height($(this).data('height') / 3);
			console.log($(this).height())
		});
	},

	expandInlineExpose: function() {
		$('#exposeSlideContainer').width($('.expose').length * $('.expose').outerWidth(true) + 10);
	},

	hideExpose: function() {
		$('#exposeSlideContainer').children().remove();
		$('#expose').hide();
	},

	exposeClick: function(e) {
		e.preventDefault();
		window.location = e['currentTarget']['parentElement'].id.replace('lnk_', '');
		this.hideExpose();
	},
}
