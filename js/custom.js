(function($) {
    "use strict";
	
    
    //SVG Inliner (Inline SVG images which has .svg)
    jQuery("img.svg").each(function(){var t=jQuery(this),r=t.attr("id"),a=t.attr("class"),e=t.attr("src");jQuery.get(e,function(e){var i=jQuery(e).find("svg");void 0!==r&&(i=i.attr("id",r)),void 0!==a&&(i=i.attr("class",a+" replaced-svg")),!(i=i.removeAttr("xmlns:a")).attr("viewBox")&&i.attr("height")&&i.attr("width")&&i.attr("viewBox","0 0 "+i.attr("height")+" "+i.attr("width")),t.replaceWith(i)},"xml")});

    /*navigation*/
    $.extend($.easing, {
        easeInOutCubic: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    });
    $.fn.outerFind = function(selector) {
        return this.find(selector).addBack(selector);
    };
    (function($, sr) {
        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function(func, threshold, execAsap) {
            var timeout;

            return function debounced() {
                var obj = this,
                    args = arguments;

                function delayed() {
                    if (!execAsap) func.apply(obj, args);
                    timeout = null;
                };

                if (timeout) clearTimeout(timeout);
                else if (execAsap) func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        }
        // smartresize 
        jQuery.fn[sr] = function(fn) {
            return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
        };

    })(jQuery, 'smartresize');
    (function() {

        var scrollbarWidth = 0,
            originalMargin, touchHandler = function(event) {
                event.preventDefault();
            };

        function getScrollbarWidth() {
            if (scrollbarWidth) return scrollbarWidth;
            var scrollDiv = document.createElement('div');
            $.each({
                top: '-9999px',
                width: '50px',
                height: '50px',
                overflow: 'scroll',
                position: 'absolute'
            }, function(property, value) {
                scrollDiv.style[property] = value;
            });
            $('body').append(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            $('body')[0].removeChild(scrollDiv);
            return scrollbarWidth;
        }

    })();
    $.isMobile = function(type) {
        var reg = [];
        var any = {
            blackberry: 'BlackBerry',
            android: 'Android',
            windows: 'IEMobile',
            opera: 'Opera Mini',
            ios: 'iPhone|iPad|iPod'
        };
        type = 'undefined' == $.type(type) ? '*' : type.toLowerCase();
        if ('*' == type) reg = $.map(any, function(v) {
            return v;
        });
        else if (type in any) reg.push(any[type]);
        return !!(reg.length && navigator.userAgent.match(new RegExp(reg.join('|'), 'i')));
    };
    var isSupportViewportUnits = (function() {
        // modernizr implementation
        var $elem = $('<div style="height: 50vh; position: absolute; top: -1000px; left: -1000px;">').appendTo('body');
        var elem = $elem[0];
        var height = parseInt(window.innerHeight / 2, 10);
        var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['height'], 10);
        $elem.remove();
        return compStyle == height;
    }());


    $(function() {

        $('html').addClass($.isMobile() ? 'mobile' : 'desktop');

        if ($.fn.jarallax && !$.isMobile()) {
            $(document).on('destroy.parallax', function(event) {
                $(event.target).outerFind('.mbr-parallax-background, .parallaxbg')
                    .jarallax('destroy')
                    .css('position', '');
            });
            $(document).on('add.cards change.cards', function(event) {
                $(event.target).outerFind('.mbr-parallax-background, .parallaxbg')
                    .jarallax()
                    .css('position', 'relative');
            });
        }

        var oMenuLink = $('#menu-tog'),
            oNav = $('#navigation'),
            oSubMenu = oNav.find('.submenu');

        /* Desktop, tablet and mobile menu
        ================================================== */
        if (oSubMenu.length) {
            oSubMenu.parent().addClass('has-submenu');
        };

        oMenuLink.on('click', function(e) {
            e.preventDefault();

            var $this = $(this);

            if ($this.hasClass('active')) {

                oNav.slideUp('fast');
                oSubMenu.css({
                    display: 'none'
                });

                $this.removeClass('active');

                oNav.find('a.drop_active').removeClass('drop_active');

            } else {

                oNav.slideDown('fast');

                $this.addClass('active');

                /*if ($headerOffset > 0 && !$header.hasClass("header__fixed")) {
                $('body,html').stop().animate({ scrollTop: $headerOffset } , 300);
                };*/
            };
        });

        oNav.on('touchend click', 'ul>li>a', function() {
            var $this = $(this);

            if (oMenuLink.is(':visible')) {
                if ($this.next().is('div.submenu')) {
                    if ($this.next().is(':visible')) {

                        $this.removeClass('drop_active');
                        $this.next().slideUp('fast');
                        $this.next().find('.submenu').css({
                            display: 'none'
                        });

                    } else {

                        $this.closest('ul').find('a.drop_active').removeClass('drop_active');
                        $this.closest('ul').find('.submenu').slideUp('fast');
                        $this.addClass('drop_active');
                        $this.next().slideDown('fast');
                    };

                    return false;
                };
            };
        });

        $(window).smartresize(function() {
            if ($(this).width() > 991) {

                oMenuLink.removeClass('active');
                oNav.removeAttr('style');
                oSubMenu.removeAttr('style');
                oNav.find('a.drop_active').removeClass('drop_active');
            }
        });

        $('#go-bottom').on('click', function(e) {
            e.preventDefault();
            $('body,html').stop().animate({
                scrollTop: document.documentElement.clientHeight
            }, 1000);
        });

        // init
        $('body > *:not(style, script)').trigger('add.cards');
        $('html').addClass('mbr-site-loaded');
        $(window).resize().scroll();

    });
        
    
    /* Preloader */
    $(window).load(function() {
        $('.loader').fadeOut();
        $('.page-loader').delay(350).fadeOut('slow');
    });

    
    /* Go up */
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() > 800) {
            jQuery(".go-up").css("bottom", "10px");
        } else {
            jQuery(".go-up").css("bottom", "-60px");
        }
    });
    jQuery(".go-up").click(function() {
        jQuery("html,body").animate({
            scrollTop: 0
        }, 500);
        return false;
    });
    
	/* STICKY NAVIGATION */
    $(window).scroll(function() {
        if ($(this).scrollTop() > 0) {
            $('.header').addClass("sticky");
        } else {
            $('.header').removeClass("sticky");
        }
    });
    
	/* --- WOW Animation --- */
	var wow = new WOW({
			mobile: false
		});

	wow.init();
    
    
})(jQuery);

    