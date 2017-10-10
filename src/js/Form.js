/**
 * Created by Vineeth on 09-10-2017.
 */
import SmoothScroll from 'smooth-scroll';
import validate from 'jquery-validation';
export default  function () {
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your inputregex."
);
    $(document).ready(function() {
    $('select').material_select();
  });
    var validateForm = $("#register").validate({
        errorClass: "error-msg",
        rules: {
            name: {
                required: true,
                minlength: 5
            },
            regno:{
                required: true,
                regex: {
                    param:"1([0-9])([a-zA-Z]{3})([0-9]{4})",
                    depends: function(element) {
                        console.log("I am checked")
                        return ($("#internal").is(":checked"));
                    }
                }
            },
            phone:{
                required:true,
                minlength:9,
                maxlength:13
            },
            email:{
                required:true,
                email: true
            },
            gender:{
                required:false
            },
            participating:{
                required:false
            },
            internal_external:{
                required: false
            },
            hosteller:{
                required:false
            },
            internal_external:{
                required:true
            },
            gender:{
                required:true
            },
            participating:{
                required:true
            },
            hosteller:{
                required:function(element){
                    return $("input[name='internal_external']:checked").val() == 'internal'
                }
            },
            block:{
                required: function(element){
                    return $("input[name='internal_external']:checked").val() == 'internal' && $("input[name='hosteller']:checked").val() == 'hosteller'; 
                }
            },
            roomno:{
                required: function(element){
                    return $("input[name='internal_external']:checked").val() == 'internal' && $("input[name='hosteller']:checked").val() == 'hosteller'; 
                }
            }

        },
        //For custom messages
        messages: {
            name:{
                minlength: "Enter a valid name"
            },
            regno:{
                regex:"Enter a valid registration no."
            },
            phone:{
                minlength: "Enter a valid phone no.",
                maxlength: "Enter a valid phone no."
            }

        },
        errorElement : 'div',
        errorPlacement: function(error, element) {
          var placement = $(element).data('error');
          if (placement) {
            $(placement).append(error)
          } else {
            error.insertAfter(element);
          }
        }
     });

    $('#registerContainer').click(function(){
        let scroll = new SmoothScroll();
        let anchor = document.querySelector( '#registerContainer' );
        scroll.animateScroll( anchor );
        $(this).find('#progress').removeClass('hide');
        $(this).removeClass('wht').addClass('cardWhite');
        $(this).find('#register').css({
            'height':'100%',
        });
        $("#internal").click();
    });
    $('.registerRedirect').click(function (e) {
        e.preventDefault();
        $('#registerContainer').click();
    });
    // hide all by default
    $("#external_info").hide();
    $("#internal_info").hide();
    $("#hosteller_info").hide();

    // for internal or external
    $("input[name='internal_external']").change(function () {
      if ($("input[name='internal_external']:checked").val() == 'internal') {
        $("#internal_info").fadeIn();
        $("#external_info").hide();
      }
      else{
        $("#internal_info").hide();
        $("#external_info").fadeIn();
      }
    });

    // for hosteller or dayboarder
    $("input[name='hosteller']").change(function () {
      if ($("input[name='hosteller']:checked").val() == 'hosteller') {
        $("#hosteller_info").fadeIn();
      }
      else{
        $("#hosteller_info").hide();
      }
    });

    //select Internal by default
    // $("#internal").click();

    $('form#register').click(function (e) {
        e.stopPropagation();
    });
    function send(x){
        let $reg=$('#register');
        let obj={};
        for(let i=0;i<x.length;i++){
            obj[x[i].name]=x[i].value;
        }
        console.log(obj);
        $.ajax({
            url:'http://139.59.82.201:8081',
            type:'post',
            data:JSON.stringify(obj),
            'processData': false,
            'contentType': 'application/json',
            success:function (data) {
                console.log(data);
                $('#progress-form').removeClass('progress-current');
                $('#progress-meetup').removeClass('progress-todo').addClass('progress-done progress-current');
                if(data.status){
                    $reg.after($(
                        `<div class="container center-align">
    <i class="fa fa-meetup fa-5x" aria-hidden="true"></i>
    <h5 class="center-align">Almost there !</h5><br>
    <h6>Complete the registration by sending a RSVP in meetup.</h6>
    <a target="_blank" style="width: 200px;margin: 10px auto" class="button-hex blk rsvp" href="https://www.meetup.com/GDG-VIT/events/242833405/">RSVP NOW !</a>    
</div>`
                    ));
                }
                else{
                    $reg.after($(
                        `<div class="container center-align">
    <i class="fa fa-meetup fa-5x" aria-hidden="true"></i>
    <h5>You have already registered !</h5><br>
    <h6 style="font-size: small;">We know you love our events, but its deja vu all over again.</h6><br>
    <h6>Check yor RSVP in meetup.</h6>
    <a target="_blank" style="width: 200px;margin: 10px auto" class="button-hex blk rsvp" href="https://www.meetup.com/GDG-VIT/events/242833405/">Check RSVP</a>
</div>`
                    ));
                }
                $('.rsvp').click(function () {
                    $('#progress-meetup').removeClass('progress-current');
                });
                $reg.remove();
                let scroll = new SmoothScroll();
                let anchor = document.querySelector( '#registerContainer' );
                scroll.animateScroll( anchor );
            }
        })
    }
    $('#register').submit(function (e) {
       e.preventDefault();

       if(validateForm.numberOfInvalids()===0)
       send($(this).serializeArray());
        else{
            // show error
            console.log(validateForm.numberOfInvalids())
        }
    });
}
