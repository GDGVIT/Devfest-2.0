/**
 * Created by Vineeth on 09-10-2017.
 */
import SmoothScroll from 'smooth-scroll';
export default  function () {
    $('#registerContainer').click(function(){
        let scroll = new SmoothScroll();
        let anchor = document.querySelector( '#registerContainer' );
        scroll.animateScroll( anchor );
        $(this).removeClass('wht').addClass('cardWhite');
        $(this).find('#register').css({
            'height':'100%',
        })
    });
    $('form#register').click(function (e) {
        e.stopPropagation();
    });
    function send(x){
        let obj={};
        for(let i=0;i<x.length;i++){
            obj[x[i].name]=x[i].value;
        }
        console.log(obj);
        $.ajax({
            url:'https://139.59.82.201',
            type:'post',
            data:JSON.stringify(obj),
            'processData': false,
            'contentType': 'application/json',
            success:function (data) {
                console.log(data);
                $('#register').parent().html('')
            }
        })
    }
    $('#register').submit(function (e) {
       e.preventDefault();
       send($(this).serializeArray());
    });

}