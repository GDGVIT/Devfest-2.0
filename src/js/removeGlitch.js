/**
 * Created by Vineeth on 30-09-2017.
 */
import $ from 'jquery';
export default function () {
    const $rg=$('.glitch-dots');
    $rg.eq(0).children('img').eq(0).addClass('fade-dots').siblings().remove();
    $rg.eq(1).children('img').eq(0).addClass('fade-dots').siblings().remove();
    $rg.removeClass('glitch-dots');
}