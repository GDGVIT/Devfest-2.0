/**
 * Created by Vineeth on 09-10-2017.
 */
export default  function () {
    $('#registerContainer').click(function(){
        $(this).css({
            'width':'80%'
        }).removeClass('wht').addClass('cardWhite');
        $(this).find('#register').css({
            'height':'100%',
        })
    });
    function send(x){
        let name,regno,email,gender,hosteller,participating,obj={};
        for(let i=0;i<x.length;i++){
            obj[x[i].name]=x[i].value;
        }
        console.log(obj);
        $.ajax({
            url:'https://139.59.82.201',
            type:'post',
            data:obj,
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