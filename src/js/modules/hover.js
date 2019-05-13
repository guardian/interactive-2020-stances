let touchTimer;

export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.is-tooltippable').mouseover(function(e) {
            this.showToolTipFor(e.currentTarget);
            this.setMouseOut(e.currentTarget);
        }.bind(this));

        $('.is-tooltippable').click(function(e) {
            this.showToolTipFor(e.currentTarget);
            this.setTapTimer();
        }.bind(this));

        $('.uit-tooltip__catch').click(function() {
            this.hideToolTip();
        }.bind(this));
    },

    showToolTipFor: function(el) {
        this.hideToolTip();

        var data = $(el).data();
        var top, left;
        var pointPosition = $(el).offset();
        var elementHeight = $(el).height();
        var html = document.documentElement;
        var pageOffset = $('.uit').offset().top;

        this.populateToolTipForCandidate(data);
        top = pointPosition.top + elementHeight - pageOffset;
        left = pointPosition.left

        $('.uit-tooltip').attr('style', '');

        $('.uit-tooltip').css({
            top: top,
        });

        if ($(window).width() >= 780) {
            $('.uit-tooltip').css({
                left: left
            });
        }

        $('.uit-tooltip').addClass('is-visible');
    },

    setMouseOut: function(el) {
        $(el).one('mouseout', function() {
            this.hideToolTip()
        }.bind(this));
    },

    setTapTimer: function() {
        if ($(window).width() <= 780) {
            $('.uit-tooltip__catch').addClass('is-visible');
            clearTimeout(touchTimer);

            touchTimer = setTimeout(function() {
                this.hideToolTip();
            }.bind(this), 15000);
        }
    },

    hideToolTip: function() {
        clearTimeout(touchTimer);
        $('.uit-tooltip').removeClass('is-visible');
        $('.uit-tooltip__catch').removeClass('is-visible');
    },

    populateToolTipForRadar: function(data) {
        $('.uit-tooltip__title-copy').text(data.group);
        $('.uit-tooltip__secondary').text(`This puts ${data.candidate} in ${this.convertValueToString(data.value)} when compared to fellow democrat presidential nominees on the issue of ${data.issue}`);
    },

    populateToolTipForCandidate: function(data) {
        $('.uit-tooltip__title-copy').text(data.name);
        $('.uit-tooltip__secondary').html(data.quote);
    },

    convertValueToString: function(value) {
        value = parseFloat(value);

        if (value >= 1.2) {
            return 'the most progressive group';
        } else if (value <= 0.6) {
            return 'the most moderate group';
        } else {
            return 'one of the in-betweenie groups';
        }
    }
};
