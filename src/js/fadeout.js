import $ from 'jquery';

export default function fadeParallax() {
    //dom queries here save queries in a variable flag also here -boolean
    // one more flag to check to if elemets re hidden or not.,'.classifiedWrap','.mobHide'
    var right = $('#register-button,.classifiedWrap,#coordTrack');
    var left = $('#watch-button, .trackWrap ,#gdgTopLogo');
    var hide = $('.mobHide img,#glitch-left img,#mouse-button');
    var doc = $(document);
    $(function () {
        $(window).scroll(function () {
            if (doc.scrollTop() > 150) {
                if (right.hasClass('fadeInRight') || left.hasClass('fadeInLeft')) {
                    right.removeClass('fadeInRight');
                    left.removeClass('fadeInLeft');
                    hide.removeClass('fadeIn');
                }
                right.addClass('animated fadeOutRight');
                left.addClass('animated fadeOutLeft');
                hide.addClass('animated fadeOut');

            } else {
                if (right.hasClass('fadeOutRight') || left.hasClass('fadeOutLeft')) {
                    right.removeClass('fadeOutRight');
                    left.removeClass('fadeOutLeft');
                    hide.removeClass('fadeOut');
                }
                right.addClass('fadeInRight');
                left.addClass('fadeInLeft');
                hide.addClass('fadeIn');
            }
        });


    });


    // sepeate func handle the scrolltop event - no dom queries , bind this function to scroll event
}
