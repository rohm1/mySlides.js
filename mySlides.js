function mySlides(userParams) {
	/************* variables ******************/
	var params = {
		title: 'My Prez',
		style: 'prez1',
		path: 'styles',
		lang: 'en',

		footerPageStyle: '%p/%t',
		footerDisplay: true,
		footerAutoHide: true,
		footerShowDuration: 1500,
		footerDisplayTime: 200,
		footerHideTime: 200,
		footerShowMethod: 'slide',
		footerHideMethod: 'slide',
	}, nbr, crt, hash = -1;

	var lang = {
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

	/*************   init    ******************/
	this.init = function() {
		if(userParams != undefined) {
			for(param in userParams)
				params[param] = userParams[param];
		}

		$.ajax({url: params.path + '/' + params.style + '/style.css',
				success: function(css) {
					$('head').append( $('<style></style>').attr('type', 'text/css').html(css) );
				},
				error: function() {
					alert('Could not load ' + params.style);
				}
			});

		$(document).ready(function() {
			document.title = params.title;

			var d = new Date(),
				l = lang[params.lang] == undefined ? lang[lang.defaultLang] : lang[params.lang];
			$('.date').html( l.format.replace('%j', d.getDate()).replace('%N', l.days[d.getDay()]).replace('%F', l.months[d.getMonth()]).replace('%Y', d.getFullYear()) );

			$(document).keydown(function(e) {
				switch(e.which) {
					case 39: /*right*/
					case 40: /*down*/
					case 32: /*space*/
					case 78: /*n*/
						document.location.hash = crt+1;
						e.preventDefault();
						break;
					case 37: /*left*/
					case 38: /*up*/
					case 8: /*back*/
					case 80: /*p*/
						document.location.hash = crt-1;
						e.preventDefault();
						break;
					default:
						break;
				}
			});

			nbr = $('.slide').length;
			setInterval(function() {
				if(window.location.hash != hash) {
					crt = parseInt(document.location.hash.replace('#', ''));
					crt = (isNaN(crt) || crt < 1) ? 1 : (crt > nbr ? nbr : crt);
					document.location.hash = crt;
					hash = document.location.hash;
					$('.slide').hide().eq(crt-1).show();
					$('.page').html( params.footerPageStyle.replace('%p', crt).replace('%t', nbr) );
				}
			}, 20);
		})
	};
	this.init();
};
