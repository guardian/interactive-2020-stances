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
        $('.uit-radar__point-hotspot').mouseover(function(e) {
            this.showToolTipFor(e.currentTarget);
        }.bind(this));

        $('.uit-radar__point-hotspot').click(function(e) {
            this.showToolTipFor(e.currentTarget);
        }.bind(this));

        $(window).resize(function() {
            this.setParentValues();
        }.bind(this));
    },

    showToolTipFor: function(el) {
        var data = $(el).data();

        $('.uit-candidates__tooltip-label').text(data.group);
        $('.uit-candidates__description-name').text(data.candidate);
        $('.uit-candidates__description-issue').text(data.issue);
        $('.uit-candidates__description-value').text(this.convertValueToString(data.value));

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

    convertValueToString: function(value) {
        value = parseFloat(value);

        if (value >= 1.7) {
            return 'the most progressive group';
        } else if (value <= 1.2) {
            return 'the most moderate group';
        } else {
            return 'one of the in-betweenie groups';
        }
    }
};
