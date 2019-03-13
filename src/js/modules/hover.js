let touchTimer;

export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.is-tooltippable').mouseover(function(e) {
            this.showToolTipFor(e.currentTarget);
        }.bind(this));

        $('.is-tooltippable').click(function(e) {
            this.showToolTipFor(e.currentTarget);
            this.setTapTimer();
        }.bind(this));
    },

    showToolTipFor: function(el) {
        var data = $(el).data();
        var type = $(el).hasClass('uit-radar__point-hotspot') ? 'radar' : 'candidate';

        if (type === 'radar') {
            this.populateToolTipForRadar(data);
        } else {
            this.populateToolTipForCandidate(data);
        }

        var pointPosition = $(el).offset();
        var elementHeight = $(el).height();
        var pageOffset = $('.uit').offset().top;

        $('.uit-tooltip').css({
            top: pointPosition.top + elementHeight - pageOffset,
        });

        if ($(window).width() >= 780) {
            $('.uit-tooltip').css({
                left: pointPosition.left
            });
        }

        $('.uit-tooltip').addClass('is-visible');

        $(el).one('mouseout', function() {
            $('.uit-tooltip').removeClass('is-visible');
        });
    },

    setTapTimer: function() {
        if ($(window).width() <= 780) {
            clearTimeout(touchTimer);

            touchTimer = setTimeout(function() {
                $('.uit-tooltip').removeClass('is-visible');
            }, 15000);
        }
    },

    populateToolTipForRadar: function(data) {
        $('.uit-tooltip').removeClass('is-quote');
        $('.uit-tooltip__title-copy').text(data.group);
        $('.uit-tooltip__secondary').text(`This puts ${data.candidate} in ${this.convertValueToString(data.value)} when compared to fellow democrat presidential nominees on the issue of ${data.issue}`);
    },

    populateToolTipForCandidate: function(data) {
        $('.uit-tooltip').addClass('is-quote');
        $('.uit-tooltip__title-copy').text(data.quote);
        $('.uit-tooltip__secondary').html(data.source);
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
