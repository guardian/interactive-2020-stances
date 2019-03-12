import Snap from 'snapsvg';

const animationDuration = 2000;

let large, largePoints, smallPoints;

export default {
    init: function() {
        this.getPoints();
        this.bindings();
        this.findLegendToAnimate();
        this.animateLegend();
    },

    bindings: function() {
        $(window).resize(function() {
            this.findLegendToAnimate();
        }.bind(this));
    },

    getPoints: function() {
        largePoints = $('#uit-large').attr('d');
        smallPoints = $('#uit-small').attr('d');
    },

    findLegendToAnimate: function() {
        $('.uit-candidates__legend').removeClass('is-visible');

        if ($(window).width() >= 960) {
            $('.uit-candidates__overview .uit-candidates__legend').addClass('is-visible');
        } else {
            $('.uit-content .uit-candidates__legend').addClass('is-visible');
        }

        large = Snap.select('.is-visible #uit-large');
    },

    animateLegend: function() {
        const toLarge = function() {
            $('.uit-candidates__legend-state').removeClass('is-active');
            $('.uit-candidates__legend-state--large').addClass('is-active');
            large.animate({d: largePoints}, animationDuration, mina.backout, toSmall);
        }

        const toSmall = function() {
            $('.uit-candidates__legend-state').removeClass('is-active');
            $('.uit-candidates__legend-state--small').addClass('is-active');
            large.animate({d: smallPoints}, animationDuration, mina.backout, toLarge);
        }

        toSmall();
    }
};
