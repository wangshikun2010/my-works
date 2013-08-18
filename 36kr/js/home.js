
$(function() {
    var ndMenu = $('#menu');
    var ndNav = $('#nav');

    if ($.browser.msie && $.browser.version < '9.0') {
        // alert($.browser.version);

        ndMenu.delegate('li', 'mouseover', function() {
            $(this).find('.menu-item-content').show();
        });

        ndMenu.delegate('li', 'mouseout', function() {
            $(this).find('.menu-item-content').hide();
        });

        function navPosition(x, y) {
            ndNav.css({
                'position': 'absolute',
                'left': ($(window).scrollLeft() + x) + 'px',
                'top': ($(window).scrollTop() + y) + 'px'
            });
        }

        navPosition(110, 153);

        $(window).scroll(function() {
            navPosition(110, 153);
        });
    }

});