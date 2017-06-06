/**
 * Created by 35107 on 2017/5/25.
 */

~function () {
    var step = 0, mark = 0;
    var banner = undoTools.getEleByClass('banner')[0],
        leftBtn = undoTools.getEleByClass('leftBtn')[0],
        rightBtn = undoTools.getEleByClass('rightBtn')[0],
        slides = undoTools.getEleByClass('slide'),
        tips = undoTools.getEleByClass('tip')[0].getElementsByTagName('li');
    var len = slides.length;

    (function () {
        for (var i = 0; i < tips.length; i++) {
            var curTip = tips[i];
            curTip.index = i;
            curTip.onclick = function () {
                step = this.index;
                if (step === mark) {
                    return;
                }
                fade();
            }
        }
    })();

    leftBtn.onclick = moveLeft;
    rightBtn.onclick = moveRight;
    function moveRight() {
        if (step === (len - 1)) {
            step = -1;
        }
        step++;
        fade();
    }

    function moveLeft() {
        if (step === 0) {
            step = len;
        }
        step--;
        fade();
    }

    function fade() {
        undoTools.animate(slides[step], {zIndex: 8, opacity: 1}, 300, function () {
            this.id = 'slide' + (step + 1);
            changeTip();
        });
        undoTools.animate(slides[mark], {zIndex: 0, opacity: 0}, 300, function () {
            this.id = '';
        });
        mark = step;
    }

    function changeTip() {
        for (var i = 0; i < tips.length; i++) {
            var curTip = tips[i];
            if (i === step) {
                curTip.className = 'cur';
            } else {
                curTip.className = '';
            }
        }
    }


    var bannerContainer = undoTools.getEleByClass('banner-container')[0];
    banner.addEventListener('touchstart', touchStart, false);
    banner.addEventListener('touchmove', touchMove, false);
    banner.addEventListener('touchend', touchEnd, false);
    console.dir(banner);


    var winW = document.documentElement.clientWidth;

    function touchStart(ev) {
        //console.log(ev);
        var point = ev.touches[0];
        this['strL'] = point.clientX;
        this['disX'] = null;
        this['move'] = null;
    }

    function touchMove(ev) {
        var point = ev.touches[0];
        this['curL'] = point.clientX;
        this['disX'] = this.curL - this.strL;
        if (Math.abs(this.disX) > winW / 3) {
            this['move'] = true;
        }
    }

    function touchEnd(ev) {
        if (this['move']) {

            this.disX > 0 ? moveLeft() : moveRight();
        }
    }
}();