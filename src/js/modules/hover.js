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
        var data = $(el).data();
        var top, left;
        var pointPosition = $(el).offset();
        var elementHeight = $(el).height();
        var html = document.documentElement;
        var pageOffset = $('.uit').offset().top;
        var isReversed = $(el).parent().parent().hasClass('uit-issue__group--last');

        this.populateToolTipForCandidate(data);
        top = pointPosition.top + elementHeight - pageOffset;
        left = pointPosition.left

        $('.uit-tooltip').attr('style', '');

        $('.uit-tooltip').css({
            top: top,
        });

        if ($(window).width() >= 780) {
            $('.uit-tooltip').css({
                left: isReversed ? left - $('.uit-tooltip').width() + 42 : left
            });
        }

        if (isReversed) {
            $('.uit-tooltip').addClass('is-reversed');
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
        $('.uit-tooltip').removeClass('is-visible is-reversed');
        $('.uit-tooltip__catch').removeClass('is-visible');
    },

    populateToolTipForCandidate: function(data) {
        $('.uit-tooltip__title-copy').text(data.name);
        $('.uit-tooltip__secondary').html(data.quote);
    }
};
