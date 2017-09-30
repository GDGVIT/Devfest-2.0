/**
 * Created by Vineeth on 30-09-2017.
 */

export default  function () {
    const $top=$('#devfest-logo-top');
    $top.css('visibility','visible');
    $('.landing-wrapper').after($top);
    let $bottom=$('#devfest-fixed');
    let top=$top.offset().top,bottom=$bottom.offset().top,flag=false;
    function handleScroll(e) {
        let scroll=e.srcElement.scrollingElement.scrollTop;
        console.log(scroll,top,bottom);
        if(flag){
            if(scroll+top<bottom){
                flag=false;
                $bottom.css('visibility','hidden');
                $top.css('visibility','visible');
            }
        }
        else {
            if(scroll+top>=bottom){
                flag=true;
                $top.css('visibility','hidden');
                $bottom.css('visibility','visible');
            }
        }
    }
    document.onscroll=handleScroll;
}
