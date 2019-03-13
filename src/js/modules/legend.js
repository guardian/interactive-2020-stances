import Snap from 'snapsvg';

const animationDuration = 2000;

const largePoints = 'M192,222.4c-16,38.9,45.3,74.4,57.5,128.1c12.3,53.7-27.6,112.3,3.7,140.3c31.3,28.1,112.3,26,152.8,0 c40.5-26,37.2-76.2,49.5-129.9s36.9-97.5,11.8-138.5s-82.6-66.3-137.6-66.3S208,183.5,192,222.4';

const smallPoints = 'M262.3,277.6c-11.2,17.4,8.3,41.6,14.6,69.2c6.3,27.6,0.7,60.9,16.9,68.7c16.2,7.8,38.7-17.4,64.2-29.6 c25.5-12.3,56.6-12.1,63.2-31.7s-12.7-47.4-30.3-66.2C373.2,269,358.7,262,333,260C307.3,257.9,273.5,260.2,262.3,277.6'

let svgBlob;

export default {
    init: function() {
        this.bindings();
        this.findLegendToAnimate();
        this.animateLegend();
    },

    bindings: function() {
        $(window).resize(function() {
            this.findLegendToAnimate();
        }.bind(this));
    },

    findLegendToAnimate: function() {
        $('.uit-candidates__legend').removeClass('is-visible');

        if ($(window).width() >= 960) {
            $('.uit-candidates__overview .uit-candidates__legend').addClass('is-visible');
        } else {
            $('.uit-content .uit-candidates__legend').addClass('is-visible');
        }

        svgBlob = Snap.select('.is-visible #uit-legend__blob');
    },

    animateLegend: function() {
        const toLarge = function() {
            $('.uit-candidates__legend-state').removeClass('is-active');
            $('.uit-candidates__legend-state--large').addClass('is-active');
            svgBlob.animate({d: largePoints}, animationDuration, mina.backout, toSmall);
        }

        const toSmall = function() {
            $('.uit-candidates__legend-state').removeClass('is-active');
            $('.uit-candidates__legend-state--small').addClass('is-active');
            svgBlob.animate({d: smallPoints}, animationDuration, mina.backout, toLarge);
        }

        toSmall();
    }
};
