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
        var text = $(el).attr('data-group');

        $('.uit-candidates__tooltip-label').text(text);

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
    }
};
