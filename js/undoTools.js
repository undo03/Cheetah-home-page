/**
 * Created by 35107 on 2017/5/25.
 */
'use strict';
var undoTools = (function () {
    var isSupport = 'getComputedStyle' in window;

    function hasClass(curEle, cName) {
        return new RegExp('(^| +)' + cName + '( +|$)').test(curEle.className);
    }

    function addClass(curEle, strClass) {
        var reg = null;
        strClass = strClass.replace(/(^ +| +$)/g, '').split(/ +/g);
        for (var i = 0; i < strClass.length; i++) {
            var curClass = strClass[i];
            reg = new RegExp('(^| +)' + curClass + '( +|$)');
            if (!reg.test(curEle.className)) {
                curEle.className += ' ' + curClass;
            }
        }
    }

    function removeClass(curEle, strClass) {
        strClass = strClass.replace(/(^ +| +$)/g, '').split(/ +/);
        var reg = null;
        for (var i = 0; i < strClass.length; i++) {
            var curClass = strClass[i];
            reg = new RegExp('($| +)' + curClass + '( +|$)', 'g');
            if (reg.test(curEle.className)) {
                curEle.className = curEle.className.replace(/ /g, '  ').replace(reg, ' ');
            }
        }
        curEle.className = curEle.className.replace(/(^ +| +$)/g, '');
    }

    function getElementsByClassName(strClass, context) {
        context = context || document;
        if (isSupport) {
            return context.getElementsByClassName(strClass);
        }
        var allList = context.getElementsByTagName('*'),
            ary = [],
            reg = null;
        strClass = strClass.replace(/(^ +| +$)/g, '')
            .replace(/ +/g, '@@')
            .replace(/(?:^|@)([\w-]+)(?:@|$)/g, '(?=.*(^| +)$1( +|$).*)');
        reg = new RegExp(strClass);
        for (i = 0; i < allList.length; i++) {
            var cur = allList[i];
            reg.test(cur.className) ? ary[ary.length] = cur : null;
        }
        return ary;
    }

    function getCss(curEle, attr) {
        var val = null, reg = null;
        if (isSupport) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === 'opacity' || attr === 'filter') {
                val = curEle.currentStyle['filter'];
                reg = /^alpha\(opacity=(.+)\)$/i;
                val = reg.test(val) ? RegExp.$1 / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        reg = /^-?\d+(\.\d+)?(px|em|pt|rem)?$/i;
        return reg.test(val) ? parseFloat(val) : val;
    }

    function setCss(curEle, attr, value) {
        if (attr === 'opacity') {
            curEle.style['filter'] = 'alpha(opacity=' + value * 100 + ')';
        }
        var reg = /^(width|height|((margin|padding)?(top|right|bottom|left)?))$/i;
        if (reg.test(attr)) {
            !isNaN(value) ? value += 'px' : null;
        }
        curEle.style[attr] = value;
    }

    function setGroupCss(curEle, options) {
        for (var attr in options) {
            if (options.hasOwnProperty(attr)) {
                setCss(curEle, attr, options[attr]);
            }
        }
    }


    function css() {
        var arg = arguments;
        if (arg.length >= 3) {
            setCss.apply(this, arg);
        } else if (arg.length === 2 && arg[1].toString() === '[object Object]') {
            setGroupCss.apply(this, arg);
        } else {
            return getCss.apply(this, arg);
        }
    }

    function linear(t, b, c, d) {
        return c * t / d + b;
    }

    function animate(curEle, target, duration, callBack) {
        var begin = {}, change = {}, times = 0;
        for (var attr in target) {
            if (target.hasOwnProperty(attr)) {
                begin[attr] = css(curEle, attr);
                change[attr] = target[attr] - begin[attr];
            }
        }

        window.clearInterval(curEle.animateTimer);
        curEle.animateTimer = window.setInterval(function () {
            times += 17;
            if (times >= duration) {
                css(curEle, target);
                window.clearInterval(curEle.animateTimer);
                typeof callBack === 'function' ? callBack.call(curEle) : null;
                return;
            }
            for (var attr in target) {
                if (target.hasOwnProperty(attr)) {
                    var curPos = linear(times, begin[attr], change[attr], duration);
                    css(curEle, attr, curPos);
                }
            }

        }, 17);
    }

    return {
        css: css,
        animate: animate,
        addClass: addClass,
        removeClass: removeClass,
        getEleByClass: getElementsByClassName
    }
})();