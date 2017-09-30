/**
 * Created by Vineeth on 30-09-2017.
 */
import $ from 'jquery';
export default function () {
    const $rg=$('.glitch-dots');
    $rg.eq(0).children('img').eq(0).addClass('fade-dots').css('position','fixed').siblings().remove();
    $rg.eq(1).children('img').eq(0).addClass('fade-dots').css('position','fixed').siblings().remove();
    $rg.removeClass('glitch-dots');
    const $lw=$('.loadWrap');
    $lw.after($(`<a id="mouse-button" class="animated fadeInUp"><span class="mouse"><span class="mouse-scroll"></span></span></a>`));
    $lw.remove();
    $('.example-three').remove();
}