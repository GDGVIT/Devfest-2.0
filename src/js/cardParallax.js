/**
 * Created by Vineeth on 30-09-2017.
 */

export default  function () {
    let flag;
    let scroll;
    let top, bottom;
    let $doc = $(document);
    const $bottom = $('#devfest-fixed');
    const $top = $('#devfest-logo-top');
    $top.css('visibility', 'visible');
    // $('.landing-wrapper').after($top);
    function calculateOffset() {
        top = $top.offset().top;
        bottom = $bottom.offset().top;
        scroll = $doc.scrollTop();
        flag = scroll + top < bottom;
    }
    $(window).resize(function () {
        calculateOffset();
    });
    function handleScroll() {
        top = $top.offset().top;
        if(flag){
            if(top<bottom){
                flag=false;
                $bottom.css('visibility','hidden');
                $top.css('visibility','visible');
            }
        }
        else {
            if(top>=bottom){
                flag=true;
                $top.css('visibility','hidden');
                $bottom.css('visibility','visible');
            }
        }
    }
    calculateOffset();
    handleScroll();
    document.onscroll=handleScroll;
}
