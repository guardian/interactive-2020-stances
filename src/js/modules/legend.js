import Snap from 'snapsvg';

const animationDuration = 2000;

export default {
    init: function() {
        this.animateLegend();
    },

    animateLegend: function() {
        const large = Snap.select('#uit-large');
        const small = Snap.select('#uit-small');
        const largePoints = large.node.getAttribute('d');
        const smallPoints = small.node.getAttribute('d');

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
