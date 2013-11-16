var mySlides = function (userParams) {

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

    if (userParams != undefined) { //params validity is not checked; you submit shit, shit happens!
        for (param in userParams) {
            this.params[param] = userParams[param];
        }
    }

    /************* variables ******************/
    this.nbr;
    this.crt = -1;
    this.hash = -1;
    this.ntrans;
    this.curTrans;

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

    /************* contexts ******************/
    this.CONTEXT_GLOBAL = 0;
    this.CONTEXT_DRAW   = 1;

    this.context = this.CONTEXT_GLOBAL;

    /************* keyboard shortcuts ******************/
    this.keyboardSortcuts = [];

    this.keyboardSortcuts[this.CONTEXT_GLOBAL] =
         {
            'no-modificator': {
                39 /*right*/: this.next,
                40 /*down*/ : this.next,
                32 /*space*/: this.next,
                78 /*n*/    : this.next,
                37 /*left*/ : this.prev,
                38 /*up*/   : this.prev,
                 8 /*back*/ : this.prev,
                80 /*p*/    : this.prev,
            },
            'ctrl+alt': {},
        };

    this.keyboardSortcuts[this.CONTEXT_DRAW] = {};

    /************* init ******************/
    this.bind('DOMContentLoaded', this.init);
};

mySlides.prototype = {

    /************* events binding ******************/

    bind: function (event, fn, o) {
        $(o == undefined ? document : o).bind(event, {context: this, fn: fn}, this.handleEvent);
    },

    handleEvent: function (e) {
        e.data.fn.call(e.data.context, e);
    },

    keydown: function (e) {
        var shortcuts = this.keyboardSortcuts[this.context],
            code = e.which,
            available_modificators = ['ctrl', 'alt', 'shift'],
            used_modificators = [];

        for (x in available_modificators) {
            if (e[available_modificators[x] + 'Key']) {
                used_modificators.push(available_modificators[x]);
            }
        }
        used_modificators = used_modificators.join('+');

        if (used_modificators != '') {
            if (shortcuts[used_modificators] && shortcuts[used_modificators][code]) {
                shortcuts[used_modificators][code].call(this);
                e.preventDefault();
            }
        } else {
            if (shortcuts['no-modificator'] && shortcuts['no-modificator'][code]) {
                shortcuts['no-modificator'][code].call(this);
                e.preventDefault();
            }
        }
    },

    resize: function () {
        var p = $(window).height() / 1000,
            lh = 3 * p,
            fs = 130 * p;

        lh = lh < 1.8 ? 1.8 : lh;
        fs = fs < 100 ? 100 : fs;

        $('body').css({'line-height': lh + 'em', 'font-size': fs + '%'});

        if ($('.exposeInline .expose').length != 0) {
            this.expandInlineExpose();
        }

        if ($('.navPopupContextMenu').is(':visible')) {
            this.positionContextNav();
        }

        this.scaleImages();
    },

    scaleImages: function () {
        $('#slides .slide img:visible').each(function() {
            if($(this).data('height') == undefined) {
                $(this).data('height', $(this).height());
            }

            $(this).height($(this).data('height') * $(window).height() / 1000);
        });
    },

    /************* init ******************/

    init: function () {
        //set date
        var d = new Date(),
            l = this.lang[this.params.lang] == undefined ? this.lang[this.lang.defaultLang] : this.lang[this.params.lang],
            format = this.params.dateFormat == undefined ? l.format : this.params.dateFormat;

        $('.date').html(
                format
                    .replace('%j', d.getDate())
                    .replace('%l', l.days[d.getDay()])
                    .replace('%F', l.months[d.getMonth()])
                    .replace('%Y', d.getFullYear())
                    .replace('%n', d.getMonth()+1)
                    .replace('%y', d.getFullYear()%100)
                );

        //bind keys
        this.bind('keydown', this.keydown);

        //onclick binding
        $('#slides').find('[data-onclick]').each(function() {
            $(this).on('click', function() {
                $(this).toggleClass( $(this).data('onclick') );
            });
        });

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

    setInterval: function (vCallback, nDelay) {
        var oThis = this,
            aArgs = Array.prototype.slice.call(arguments, 2);

        return window.setInterval (vCallback instanceof Function ? function () {
            vCallback.apply(oThis, aArgs);
        } : vCallback, nDelay);
    },

    /************* toc ******************/

    toc: function () {
        var root = $('<ul />'),
            t = this;

        $('.section').each(function() {
            var li = t.mkTocLi($(this));

            if (t.params.tocLevel == 2) {
                var childs = $('<ul />');

                $(this).nextAll('.section, .subsection').each(function() {
                    if($(this).hasClass('section')) {
                        return false;
                    }
                    childs.append(t.mkTocLi($(this)));
                });
                if(childs.find('li').length != 0) {
                    li.append( childs );
                }
            }
            root.append(li);
        });

        $('.toc').append(root);
    },

    mkTocLi: function (elt) {
        return $('<li />').append(
            $('<a />')
                .html(elt.find('.title').html())
                .attr('href', '#' + (elt.parent().find('.slide').index(elt) + 1))
            );
    },

    /************* navigation ******************/

    next: function() {
        if (this.curTrans == this.ntrans) {
            document.location.hash = this.crt + 2;
        }  else {
            this.doTrans(1);
        }
    },

    prev: function() {
        if (this.curTrans == 0) {
            document.location.hash = this.crt;
        } else {
            this.doTrans(-1);
        }
    },

    checkSlide: function () {
        if (window.location.hash != this.hash) {
            $('.slide').eq(this.crt).find('[data-onclick]').each(function() {
                $(this).removeClass( $(this).data('onclick') );
            });

            var oldCrt = this.crt;
            this.crt = parseInt(document.location.hash.replace('#', '')) - 1;
            this.crt = (isNaN(this.crt) || this.crt < 0) ? 0 : (this.crt >= this.nbr ? this.nbr - 1 : this.crt);
            document.location.hash = this.crt + 1;
            this.hash = document.location.hash;
            $('.slide').removeClass('current').eq(this.crt).addClass('current');
            $('#pages').html( this.params.slideNumberStyle.replace('%p', this.crt + 1).replace('%t', this.nbr) );

            $('.slide').eq(this.crt).find('.body').children().hide();

            pauseTrans = $('.slide').eq(this.crt).find('[data-pause]').length;
            onlyTrans = 0;
            $('.slide').eq(this.crt).find('[data-only]').each(function() {
                var params,
                    param;

                params = $(this).data('only').toString().split('_');
                param = parseInt(params[0]);
                if(!isNaN(param) && param > onlyTrans) {
                    onlyTrans = param;
                }
                if(params.length == 2 && !isNaN(param = parseInt(params[1])) && param > onlyTrans) {
                    onlyTrans = param;
                }
            });

            this.ntrans = Math.max(pauseTrans, onlyTrans - 1);
            this.curTrans = -1;
            this.doTrans(oldCrt > this.crt ? this.ntrans + 1 : 1);
        }
    },

    doTrans: function (trans) {
        this.curTrans += trans;
        if(this.curTrans == this.ntrans || $('.slide').eq(this.crt).find('[data-pause]').length <= this.curTrans) {
            $('.slide').eq(this.crt).find('.body').children(':not([data-only])').show();
        }
        else {
            $('.slide').eq(this.crt).find('[data-pause]').eq(this.curTrans)
                .prevAll(':not([data-only])').show()
                    .end()
                .nextAll(':not([data-only])').hide();
        }

        var curTrans = this.curTrans;
        $('.slide').eq(this.crt).find('[data-only]').each(function() {
            var params,
                show = false,
                p1,
                i1,
                p2,
                i2;

            params = $(this).data('only').toString().split('_');
            p1 = parseInt(params[0]) - 1;
            i1 = isNaN(p1);
            if(params.length == 2) {
                p2 = parseInt(params[1]) - 1;
                i2 = isNaN(p2);

                if(!i1 && p1 <= curTrans && !i2 && p2 >= curTrans) {
                    show = true;
                }
                else if(!i1 && p1 <= curTrans && i2) {
                    show = true;
                }
                else if(i1 && !i2 && p2 >= curTrans) {
                    show = true;
                }
                else if(i1 && i2) {
                    show = true;
                }
            }
            else if(!i1 && p1 == curTrans) {
                show = true;
            }

            show ? $(this).show() : $(this).hide();
        });

        this.scaleImages();
    },

    showNav: function (e) {
        if(!$('#navPopup').is(':visible')) {
            if(this.params.navPopupAsContextMenu) {
                this.positionContextNav();
            }
            $('#navPopup').show();
        }
        else {
            this.hideNav();
        }
    },

    positionContextNav: function () {
        $('#navPopup').css({
            top: $('#navButton').offset().top - $('#navPopup').height(),
            left: $('#navButton').offset().left + $('#navButton').width() + parseInt($('#navButton').css('margin-right')) - $('#navPopup').width()
        });
    },

    hideNav: function () {
        $('#navPopup').hide();
    },

    navSubmit: function () {
        document.location.hash = $('#navForm input').eq(0).val();
        this.hideNav();
    },

    expose: function () {
        $('#slides .slide').each(function() {
            $('#exposeSlideContainer')
                .append(
                    $('<span />')
                        .attr('id', 'lnk_#' + ($('#slides .slide')
                        .index($(this))+1))
                            .append(
                                $(this)
                                    .clone()
                                        .addClass('expose')
                                )
                );
        });

        this.bind('click', this.exposeClick, $('.expose'));
        $('#expose .slide *').attr('style', '');
        if(this.params.exposeMode == 'inline') {
            this.expandInlineExpose();
        }
        $('#expose').show();

        $('#expose .slide img').each(function() {
            if($(this).data('height') == undefined) {
                $(this).data('height', $(this).height());
            }
            $(this).height($(this).data('height') / 3);
        });
    },

    expandInlineExpose: function () {
        $('#exposeSlideContainer').width($('.expose').length * $('.expose').outerWidth(true) + 10);
    },

    hideExpose: function () {
        $('#exposeSlideContainer').children().remove();
        $('#expose').hide();
    },

    exposeClick: function (e) {
        e.preventDefault();
        window.location = e['currentTarget']['parentElement'].id.replace('lnk_', '');
        this.hideExpose();
    },
}
