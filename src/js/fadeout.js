import $ from 'jquery';

export default function fadeParallax() {
    //dom queries here save queries in a variable flag also here -boolean
    // one more flag to check to if elemets re hidden or not.,'.classifiedWrap','.mobHide'
    var right = $('#register-button,.classifiedWrap,#coordTrack');
    var left = $('#watch-button, .trackWrap ,#gdgTopLogo');
    var hide = $('.mobHide img,#glitch-left img,#mouse-button');
    var doc = $(document);
    $(function () {

        let hideStat=false,setupStat=false;
        (function setupHide() {
            let arg=arguments;
                console.log('setup hide triggered !');
                for(let i=0;i<arg.length;i++){
                    arg[i].on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        if ($(this).hasClass('fadeOutRight') || $(this).hasClass('fadeOutLeft') || $(this).hasClass('fadeOut')) {
                            $(this).addClass('hide');
                        }
                    });
                    if (doc.scrollTop() > 250){
                        arg[i].addClass('hide');
                    }
                }
            // }
        })(right,left,hide);
        $(window).scroll(function () {
            if (doc.scrollTop() > 250) {
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
                    right.removeClass('fadeOutRight hide');
                    left.removeClass('fadeOutLeft hide');
                    hide.removeClass('fadeOut hide');
                }
                right.addClass('fadeInRight');
                left.addClass('fadeInLeft');
                hide.addClass('fadeIn');
            }
        });

        $('.slider-class').slick({
            dots: true,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 2,
            arrows : true

        });


    });


    // sepeate func handle the scrolltop event - no dom queries , bind this function to scroll event
}
