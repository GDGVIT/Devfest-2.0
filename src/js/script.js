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
$(function () {
    var timelines = $('.cd-horizontal-timeline'),
        eventsMinDistance = 60;

    (timelines.length > 0) && initTimeline(timelines);

    function initTimeline(timelines) {
        timelines.each(function(){
            var timeline = $(this),
                timelineComponents = {};
            //cache timeline components
            timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
            timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
            timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
            timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
            timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
            timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
            timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
            timelineComponents['eventsContent'] = timeline.children('.events-content');

            //assign a left postion to the single events along the timeline
            setDatePosition(timelineComponents, eventsMinDistance);
            //assign a width to the timeline
            var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
            //the timeline has been initialize - show it
            timeline.addClass('loaded');

            //detect click on the next arrow
            timelineComponents['timelineNavigation'].on('click', '.next', function(event){
                event.preventDefault();
                updateSlide(timelineComponents, timelineTotWidth, 'next');
            });
            //detect click on the prev arrow
            timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
                event.preventDefault();
                updateSlide(timelineComponents, timelineTotWidth, 'prev');
            });
            //detect click on the a single event - show new event content
            timelineComponents['eventsWrapper'].on('click', 'a', function(event){
                event.preventDefault();
                timelineComponents['timelineEvents'].removeClass('selected');
                $(this).addClass('selected');
                updateOlderEvents($(this));
                updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
                updateVisibleContent($(this), timelineComponents['eventsContent']);
            });

            //on swipe, show next/prev event content
            timelineComponents['eventsContent'].on('swipeleft', function(){
                var mq = checkMQ();
                ( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
            });
            timelineComponents['eventsContent'].on('swiperight', function(){
                var mq = checkMQ();
                ( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
            });

            //keyboard navigation
            $(document).keyup(function(event){
                if(event.which=='37' && elementInViewport(timeline.get(0)) ) {
                    showNewContent(timelineComponents, timelineTotWidth, 'prev');
                } else if( event.which=='39' && elementInViewport(timeline.get(0))) {
                    showNewContent(timelineComponents, timelineTotWidth, 'next');
                }
            });
        });
    }

    function updateSlide(timelineComponents, timelineTotWidth, string) {
        //retrieve translateX value of timelineComponents['eventsWrapper']
        var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
            wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
        //translate the timeline to the left('next')/right('prev')
        (string == 'next')
            ? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
            : translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
    }



    function updateTimelinePosition(string, event, timelineComponents, timelineTotWidth) {
        //translate timeline to the left/right according to the position of the selected event
        var eventStyle = window.getComputedStyle(event.get(0), null),
            eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
            timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
            timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
        var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

        if( (string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate) ) {
            translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
        }
    }

    function translateTimeline(timelineComponents, value, totWidth) {
        var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
        value = (value > 0) ? 0 : value; //only negative translate value
        value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
        setTransformValue(eventsWrapper, 'translateX', value+'px');
        //update navigation arrows visibility
        (value == 0 ) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
        (value == totWidth ) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
    }

    function updateFilling(selectedEvent, filling, totWidth) {
        //change .filling-line length according to the selected event
        var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
            eventLeft = eventStyle.getPropertyValue("left"),
            eventWidth = eventStyle.getPropertyValue("width");
        eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
        var scaleValue = eventLeft/totWidth;
        setTransformValue(filling.get(0), 'scaleX', scaleValue);
    }

    function setDatePosition(timelineComponents, min) {
        for (let i = 0; i < timelineComponents['timelineDates'].length; i++) {
            var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
                distanceNorm = Math.round(distance/timelineComponents['eventsMinLapse']) + 2;
            timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm*min+'px');
        }
    }

    function setTimelineWidth(timelineComponents, width) {
        var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
            timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
            timeSpanNorm = Math.round(timeSpanNorm) + 4,
            totalWidth = timeSpanNorm*width;
        timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
        updateFilling(timelineComponents['timelineEvents'].eq(0), timelineComponents['fillingLine'], totalWidth);

        return totalWidth;
    }

    function updateVisibleContent(event, eventsContent) {
        var eventDate = event.data('date'),
            visibleContent = eventsContent.find('.selected'),
            selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
            selectedContentHeight = selectedContent.height();

        if (selectedContent.index() > visibleContent.index()) {
            var classEnetering = 'selected enter-right',
                classLeaving = 'leave-left';
        } else {
            var classEnetering = 'selected enter-left',
                classLeaving = 'leave-right';
        }

        selectedContent.attr('class', classEnetering);
        visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
            visibleContent.removeClass('leave-right leave-left');
            selectedContent.removeClass('enter-left enter-right');
        });
        eventsContent.css('height', selectedContentHeight+'px');
    }

    function updateOlderEvents(event) {
        event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
    }

    function getTranslateValue(timeline) {
        var timelineStyle = window.getComputedStyle(timeline.get(0), null),
            timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
                timelineStyle.getPropertyValue("-moz-transform") ||
                timelineStyle.getPropertyValue("-ms-transform") ||
                timelineStyle.getPropertyValue("-o-transform") ||
                timelineStyle.getPropertyValue("transform");

        if( timelineTranslate.indexOf('(') >=0 ) {
            var timelineTranslate = timelineTranslate.split('(')[1];
            timelineTranslate = timelineTranslate.split(')')[0];
            timelineTranslate = timelineTranslate.split(',');
            var translateValue = timelineTranslate[4];
        } else {
            var translateValue = 0;
        }

        return Number(translateValue);
    }

    function setTransformValue(element, property, value) {
        element.style["-webkit-transform"] = property+"("+value+")";
        element.style["-moz-transform"] = property+"("+value+")";
        element.style["-ms-transform"] = property+"("+value+")";
        element.style["-o-transform"] = property+"("+value+")";
        element.style["transform"] = property+"("+value+")";
    }

    //based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
    function parseDate(events) {
        var dateArrays = [];
        events.each(function(){
            var dateComp = $(this).data('date').split('/'),
                newDate = new Date(dateComp[2], dateComp[1]-1, dateComp[0]);
            dateArrays.push(newDate);
        });
        return dateArrays;
    }

    function parseDate2(events) {
        var dateArrays = [];
        events.each(function(){
            var singleDate = $(this),
                dateComp = singleDate.data('date').split('T');
            if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
                var dayComp = dateComp[0].split('/'),
                    timeComp = dateComp[1].split(':');
            } else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
                var dayComp = ["2000", "0", "0"],
                    timeComp = dateComp[0].split(':');
            } else { //only DD/MM/YEAR
                var dayComp = dateComp[0].split('/'),
                    timeComp = ["0", "0"];
            }
            var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
            dateArrays.push(newDate);
        });
        return dateArrays;
    }

    function daydiff(first, second) {
        return Math.round((second-first));
    }

    function minLapse(dates) {
        //determine the minimum distance among events
        var dateDistances = [];
        for (let i = 1; i < dates.length; i++) {
            var distance = daydiff(dates[i-1], dates[i]);
            dateDistances.push(distance);
        }
        return Math.min.apply(null, dateDistances);
    }

    /*
     How to tell if a DOM element is visible in the current viewport?
     http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
     */
    function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while(el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }

    function checkMQ() {
        //check if mobile or desktop device
        return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
    }
    console.log({'is mobile device -':checkMQ()});
});
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
}
