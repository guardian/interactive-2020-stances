let offsets;

export default {
    init: function() {
        this.setParentValues();
        this.bindings();
    },

    setParentValues: function() {
        offsets = $('.uit-candidates__candidates').offset();
    },

    bindings: function() {
        $('.is-tooltippable').mouseover(function(e) {
            this.showToolTipFor(e.currentTarget);
        }.bind(this));

        $('.is-tooltippable').click(function(e) {
            this.showToolTipFor(e.currentTarget);
        }.bind(this));

        $(window).resize(function() {
            this.setParentValues();
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

        var pointPosition = el.getBoundingClientRect();
        var tooltipLeft;

        tooltipLeft = (pointPosition.left - offsets.left);

        $('.uit-candidates__tooltip').css({
            top: pointPosition.top - (offsets.top - $(window).scrollTop()),
            left: tooltipLeft
        });

        $('.uit-candidates__tooltip').addClass('is-visible');

        $(el).one('mouseout', function() {
            $('.uit-candidates__tooltip').removeClass('is-visible');
        });
    },

    populateToolTipForRadar: function(data) {
        $('.uit-candidates__tooltip-label').text(data.group);
        $('.uit-candidates__description').text(`This puts ${data.candidate} in ${this.convertValueToString(data.value)} when compared to fellow democrat presidential nominees on the issue of ${data.issue}`);
    },

    populateToolTipForCandidate: function(data) {
        $('.uit-candidates__tooltip-label').text('cool');
        $('.uit-candidates__description').text('sweet');
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
