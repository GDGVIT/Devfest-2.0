import $ from 'jquery';

export default function fadeParallax(){
  //dom queries here save queries in a variable flag also here -boolean
  // one more flag to check to if elemets re hidden or not.,'.classifiedWrap','.mobHide'
  var right = $('#register-button ,.mobHide ,.classifiedWrap');
  var left = $('#watch-button, .trackWrap ,#glitch-left');
  $(function(){
    $(window).scroll(function() {
      if ($(document).scrollTop() > 150) {
        right.addClass('animated fadeOutRight');
        left.addClass('animated fadeOutLeft');
      } else {
        right.removeClass('fadeOutRight');
        left.removeClass('fadeOutLeft');
        right.addClass('fadeInRight');
        left.addClass('fadeInLeft');
      }
    });


  });



  // sepeate func handle the scrolltop event - no dom queries , bind this function to scroll event
}
