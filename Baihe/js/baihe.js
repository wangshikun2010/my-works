$(function() {
    var bodyWidth = Math.max(document.body.clientWidth, document.body.offsetWidth);
    var regboxWidth = Math.max($('#register')[0].clientWidth, $('#register')[0].offsetWidth);
    $('#register').css('left', (bodyWidth - regboxWidth) / 2);

    $('#j-close-regbox').click(function(event) {
        event.preventDefault();
        $('#register').hide();
    });

    $('#j-user-register').click(function(event) {
        $('#register').css('left', (bodyWidth - regboxWidth) / 2);
    });

    EventUtil.addHandler(document, 'mousewheel', function(event) {
        event = EventUtil.getEvent(event);

        if (event.wheelDelta < 0) {
            if (document.body.scrollHeight < 3000) {
                var newlis = $('<li><img src="./images/id1.jpg"></li><li><img src="./images/id2.jpg"></li><li><img src="./images/id3.jpg"></li><li><img src="./images/id4.jpg"></li><li><img src="./images/id5.jpg"></li><li><img src="./images/id6.jpg"></li><li><img src="./images/id7.jpg"></li><li><img src="./images/id8.jpg"></li>');

                $('#j-user_list').append(newlis);
            }
        }
    });

    $('#j-user_list').delegate('li', 'click', function(event) {
        var that = this;

        if ($('#register').css('display') == 'none') {
            $('#register').show();
        }

        $('#j-person_info img').attr('src', $(that).find('img').attr('src'))
                                .parents('#j-person_info')
                                .show(1000);
    });

    $('#j-person_info .arrow').click(function(event) {
        $(this).parents('#j-person_info').hide(1000);
    })

})