/**
 * Created by Vineeth on 27-09-2017.
 */
import $ from 'jquery';
import 'hammerjs';
import 'materialize-css/dist/js/materialize';
import fadeParallax from './fadeout';
import removeGlitch from './removeGlitch';
import cardParallax from './cardParallax';
import SmoothScroll from 'smooth-scroll';
import form from './Form';
import 'slick-carousel';

/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
var loadCSS;
/* http://addtocalendar.com/
 *
 *
 * @license
 The MIT License (MIT)
 Copyright (c) 2015 AddToCalendar
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

(function (w, d) {
    var
        atc_url = '//addtocalendar.com/atc/',
        atc_version = '1.5';


    if (!Array.indexOf) {
        Array.prototype.indexOf = function (obj) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (this[i] == obj) {
                    return i
                }
            }
            return -1
        }
    }

    if (!Array.prototype.map) {
        Array.prototype.map = function (f) {
            var result = [];
            for (var i = 0, l = this.length; i < l; i++) {
                result.push(f(this[i]))
            }
            return result
        }
    }

    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]"
    };

    var isFunc = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Function]"
    };

    var ready = function (w, d) {
        var inited = false,
            loaded = false,
            queue = [],
            done, old;

        function go() {
            if (!inited) {
                if (!d.body) return setTimeout(go, 13);
                inited = true;
                if (queue) {
                    var j, k = 0;
                    while (j = queue[k++]) j.call(null);
                    queue = null
                }
            }
        }

        function check() {
            if (loaded) return;
            loaded = true;
            if (d.readyState === "complete") return go();
            if (d.addEventListener) {
                d.addEventListener("DOMContentLoaded", done, false);
                w.addEventListener("load", go, false)
            } else {
                if (d.attachEvent) {
                    d.attachEvent("onreadystatechange", done);
                    w.attachEvent("onload", go);
                    var k = false;
                    try {
                        k = w.frameElement == null
                    } catch (j) {
                    }
                    if (b.doScroll && k) ie()
                } else {
                    old = w.onload;
                    w.onload = function (e) {
                        old(e);
                        go()
                    }
                }
            }
        }

        if (d.addEventListener) {
            done = function () {
                d.removeEventListener("DOMContentLoaded", done, false);
                go()
            }
        } else {
            if (d.attachEvent) {
                done = function () {
                    if (d.readyState === "complete") {
                        d.detachEvent("onreadystatechange", done);
                        go()
                    }
                }
            }
        }

        function ie() {
            if (inited) return;
            try {
                b.doScroll("left")
            } catch (j) {
                setTimeout(ie, 1);
                return
            }
            go()
        }

        return function (callback) {
            check();
            if (inited) {
                callback.call(null)
            } else {
                queue.push(callback)
            }
        }
    }(w, d);

    if (w.addtocalendar && typeof w.addtocalendar.start == "function") return;
    if (!w.addtocalendar) w.addtocalendar = {};

    addtocalendar.languages = {
        'de': 'In den Kalender',
        'en': 'Add to Calendar',
        'es': 'Añadir al Calendario',
        'fi': 'Lisää kalenteriin',
        'fr': 'Ajouter au calendrier',
        'hi': 'कैलेंडर में जोड़ें',
        'in': 'Tambahkan ke Kalender',
        'ja': 'カレンダーに追加',
        'ko': '캘린더에 추가',
        'pt': 'Adicionar ao calendário',
        'ru': 'Добавить в календарь',
        'sv': 'Lägg till i kalender',
        'uk': 'Додати в календар',
        'zh': '添加到日历',
        'no': 'Legg til i kalender'
    };

    addtocalendar.calendar_urls = {}

    addtocalendar.loadSettings = function (element) {
        var settings = {
            'language': 'auto',
            'show-list-on': 'click',
            'calendars': [
                'iCalendar',
                'Google Calendar',
                'Outlook',
                'Outlook Online',
                'Yahoo! Calendar'
            ],
            'secure': 'auto',
            'on-button-click': function () {
            },
            'on-calendar-click': function () {
            }
        };

        for (var option in settings) {
            var pname = 'data-' + option;
            var eattr = element.getAttribute(pname);
            if (eattr != null) {

                if (isArray(settings[option])) {
                    settings[option] = eattr.replace(/\s*,\s*/g, ',').replace(/^\s+|\s+$/g, '').split(',');
                    continue;
                }

                if (isFunc(settings[option])) {
                    var fn = window[eattr];
                    if (isFunc(fn)) {
                        settings[option] = fn;
                    } else {
                        settings[option] = eval('(function(mouseEvent){' + eattr + '})');
                    }
                    continue;
                }

                settings[option] = element.getAttribute(pname);
            }
        }

        return settings;
    };

    addtocalendar.load = function () {

        var calendarsUrl = {
            'iCalendar': 'ical',
            'Google Calendar': 'google',
            'Outlook': 'outlook',
            'Outlook Online': 'outlookonline',
            'Yahoo! Calendar': 'yahoo'
        };
        var utz = (-(new Date()).getTimezoneOffset().toString());

        var languages = addtocalendar.languages;

        var dom = document.getElementsByTagName('*');
        for (var tagnum = 0; tagnum < dom.length; tagnum++) {
            var tag_class = dom[tagnum].className;

            if (tag_class.length && tag_class.split(" ").indexOf('addtocalendar') != -1) {

                var settings = addtocalendar.loadSettings(dom[tagnum]);

                var protocol = 'http:';
                if (settings['secure'] == 'auto') {
                    protocol = location.protocol == 'https:' ? 'https:' : 'http:';
                } else if (settings['secure'] == 'true') {
                    protocol = 'https:';
                }

                var tag_id = dom[tagnum].id;
                var atc_button_title = languages['en'];
                if (settings['language'] == 'auto') {
                    var user_lang = "no_lang";
                    if (typeof navigator.language === "string") {
                        user_lang = navigator.language.substr(0, 2)
                    } else if (typeof navigator.browserLanguage === "string") {
                        user_lang = navigator.browserLanguage.substr(0, 2)
                    }

                    if (languages.hasOwnProperty(user_lang)) {
                        atc_button_title = languages[user_lang];
                    }
                } else if (languages.hasOwnProperty(settings['language'])) {
                    atc_button_title = languages[settings['language']];
                }

                var url_parameters = [
                    'utz=' + utz,
                    'uln=' + navigator.language,
                    'vjs=' + atc_version
                ];

                var addtocalendar_div = dom[tagnum].getElementsByTagName('var');
                var event_number = -1;
                for (var varnum = 0; varnum < addtocalendar_div.length; varnum++) {
                    var param_name = addtocalendar_div[varnum].className.replace("atc_", "").split(" ")[0];
                    var param_value = addtocalendar_div[varnum].innerHTML;

                    if (param_name == 'event') {
                        event_number++;
                        continue;
                    }

                    if (param_name == addtocalendar_div[varnum].className) {
                        if (param_name == 'atc-body') {
                            atc_button_title = param_value;
                        }
                        continue;
                    }

                    if (event_number == -1) {
                        continue;
                    }

                    url_parameters.push('e[' + event_number + '][' + param_name + ']' + '=' + encodeURIComponent(param_value));
                }


                var atcb_link_id_val = (tag_id == '' ? '' : (tag_id + '_link') );
                var atcb_list = document.createElement('ul');
                atcb_list.className = 'atcb-list';

                var menu_links = '';
                for (var cnum in settings['calendars']) {
                    if (!calendarsUrl.hasOwnProperty(settings['calendars'][cnum])) {
                        continue;
                    }
                    var cal_id = calendarsUrl[settings['calendars'][cnum]];
                    var atcb_cal_link_id = (tag_id == '' ? '' : ('id="' + tag_id + '_' + cal_id + '_link"') );
                    menu_links += '<li class="atcb-item"><a ' + atcb_cal_link_id + ' class="atcb-item-link" href="'
                        + (cal_id == 'ical' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? 'webcal:' : protocol)
                        + atc_url
                        + cal_id + '?' + url_parameters.join('&')
                        + '" target="_blank" rel="nofollow">' + settings['calendars'][cnum] + '</a></li>';
                }
                atcb_list.innerHTML = menu_links;

                var atcb_link;
                if (dom[tagnum].querySelector('.atcb-link') == undefined) {
                    atcb_link = document.createElement('a');
                    atcb_link.className = 'atcb-link';
                    atcb_link.innerHTML = atc_button_title;
                    atcb_link.id = atcb_link_id_val;
                    atcb_link.tabIndex = 1;

                    dom[tagnum].appendChild(atcb_link);
                    dom[tagnum].appendChild(atcb_list);
                } else {
                    atcb_link = dom[tagnum].querySelector('.atcb-link');
                    atcb_link.parentNode.appendChild(atcb_list);
                    atcb_link.tabIndex = 1;
                    if (atcb_link.id == '') {
                        atcb_link.id = atcb_link_id_val;
                    }
                }

                if (atcb_link.addEventListener) {
                    atcb_link.addEventListener('click', settings['on-button-click'], false);
                } else {
                    atcb_link.attachEvent('onclick', settings['on-button-click']);
                }

                var item_links = dom[tagnum].querySelectorAll('atcb-item-link');

                for (var varnum = 0; varnum < item_links.length; varnum++) {
                    var item_link = item_links[varnum];
                    if (item_link.addEventListener) {
                        item_link.addEventListener('click', settings['on-calendar-click'], false);
                    }else{
                        item_link.attachEvent('onclick', settings['on-calendar-click']);
                    }

                }
            }
        }
    };
    addtocalendar.load();
})(window, document);

(function(w){
    "use strict";
    /* exported loadCSS */
    loadCSS = function( href, before, media ){
        // Arguments explained:
        // `href` [REQUIRED] is the URL for your CSS file.
        // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
        // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
        // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
        var doc = w.document;
        var ss = doc.createElement( "link" );
        var ref;
        if( before ){
            ref = before;
        }
        else {
            var refs = ( doc.body || doc.getElementsByTagName( "head" )[ 0 ] ).childNodes;
            ref = refs[ refs.length - 1];
        }

        var sheets = doc.styleSheets;
        ss.rel = "stylesheet";
        ss.href = href;
        // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
        ss.media = "only x";

        // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
        function ready( cb ){
            if( doc.body ){
                return cb();
            }
            setTimeout(function(){
                ready( cb );
            });
        }
        // Inject link
        // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
        // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
        ready( function(){
            ref.parentNode.insertBefore( ss, ( before ? ref : ref.nextSibling ) );
        });
        // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
        var onloadcssdefined = function( cb ){
            var resolvedHref = ss.href;
            var i = sheets.length;
            while( i-- ){
                if( sheets[ i ].href === resolvedHref ){
                    return cb();
                }
            }
            setTimeout(function() {
                onloadcssdefined( cb );
            });
        };

        function loadCB(){
            if( ss.addEventListener ){
                ss.removeEventListener( "load", loadCB );
            }
            ss.media = media || "all";
        }

        // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
        if( ss.addEventListener ){
            ss.addEventListener( "load", loadCB);
        }
        ss.onloadcssdefined = onloadcssdefined;
        onloadcssdefined( loadCB );
        return ss;
    };
    // commonjs
    if( typeof exports !== "undefined" ){
        exports.loadCSS = loadCSS;
    }
    else {
        w.loadCSS = loadCSS;
    }
}( typeof global !== "undefined" ? global : this ));
/*! onloadCSS. (onload callback for loadCSS) [c]2017 Filament Group, Inc. MIT License */
/* global navigator */
/* exported onloadCSS */
function onloadCSS( ss, callback ) {
    var called;
    function newcb(){
        if( !called && callback ){
            called = true;
            callback.call( ss );
        }
    }
    if( ss.addEventListener ){
        ss.addEventListener( "load", newcb );
    }
    if( ss.attachEvent ){
        ss.attachEvent( "onload", newcb );
    }

    // This code is for browsers that don’t support onload
    // No support for onload (it'll bind but never fire):
    //	* Android 4.3 (Samsung Galaxy S4, Browserstack)
    //	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
    //	* Android 2.3 (Pantech Burst P9070)

    // Weak inference targets Android < 4.4
    if( "isApplicationInstalled" in navigator && "onloadcssdefined" in ss ) {
        ss.onloadcssdefined( newcb );
    }
}
$(function () {
    console.log('jquery',$);
    console.log('materialize',Materialize);
    // ------ Scripts here --------
    let bundle=loadCSS("./css/bundle.css");
    // loadCSS( "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" );
    onloadCSS(bundle,function () {
        loadUI();
        var scroll = new SmoothScroll('a[data-scroll]');
    });

});
function loadUI() {
    $('.content-wrapper').css('display','block');
    removeGlitch();
    cardParallax();
    console.log('stylesheet loaded !');
    fadeParallax();
    form();
    $('#swap-idea').click(function () {
        if (!$(this).hasClass('idea'))
        {
            $('#ideathon-cont').html(`<p>It's in the most inane of moments, when you are dozing off to the rhythm of your teachers or rushing to submit your DA before the clock strikes twelve, that inquisitively spectacular ideas strike.</p>
                <p>But let's not wait around for those finally infrequent moments. We bring to Ideathon, Devfest '17.</p>
                <p>Get your fellow intellects and dreamers to tag along or carry your black book of ideas to the venue to hone your minds to think up brilliant ideas to not technical issues, but also social troubles we face.</p>
                <p>P.S. Fret not if you are hit by a block, we have our very own GDG mentors to guide you through.</p>`);
            $('#ideathon-qn').html('ARE YOU A GEEK OR A DEVELOPER?');
            $('#ideathon').html('HACKATHON');
            $(this).addClass('idea').removeClass('hack');
        }
        else {
            $('#ideathon-cont').html(`<p>DevFest’17 is back to bring innovators, thinkers and entrepreneurs under one roof for its third season.
                        This time around, the brain-wracking challenges, the entrepreneur’s dream-come-true pitches, and
                        the workshops come with the icing of top-notch exposure to the IT industry.</p>
                    <p>The basic premise of a Hackathon is to have technical minds peer deeply at a real world problem and
                        create a solution to solve it. This solution needs to be ideated, designed and delivered in all of 18
                        hours. Hackathon also features some revered professionals and MVPs from IT sharing their ideas
                        and thoughts on cutting edge technologies. The event shall have them impart this knowledge in one-on-one sessions or workshops.</p><br/>`);
            $('#ideathon-qn').html('ARE YOU AN IDEATOR OR ENTREPRENEUR?');
            $('#ideathon').html('IDEATHON');
            $(this).addClass('hack').removeClass('idea');
        }
    });
    let collapseToggle=false;
    $('#toggle-faq').click(function () {
        $(this).toggleClass('less');
        if($(this).hasClass('less'))
        {
            $(this).find('.center-align').html('View less');
            collapseToggle=false;
            $('.hidden-toggle').not('#toggle-faq').toggleClass('hide').removeClass('fadeOutUp').addClass('animated fadeInDown');
        }
        else {
            $(this).find('.center-align').html('View all');
            collapseToggle=true;
            $('.hidden-toggle').not('#toggle-faq').removeClass('fadeInDown').addClass('fadeOutUp');
        }
    });
    $('.hidden-toggle').not('#toggle-faq').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        if(collapseToggle){
            $(this).addClass('hide');
        }
    });
    $('#faq').collapsible({
        onOpen: function ($el) {
            let $icon=$el.find('i');
            $icon.addClass('fa-minus').removeClass('fa-plus');
        },
        onClose: function ($el) {
            let $icon=$el.find('i');
            $icon.addClass('fa-plus').removeClass('fa-minus');
        }
    });
}
