let scrollTop, windowHeight, legendHeight;

export default {
    init: function() {
        this.bindings();
        this.setValues();
        this.onScroll();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));

        $(window).resize(function() {
            this.setValues();
            this.onScroll();
        }.bind(this));
    },

    setValues: function() {
        windowHeight = $(window).height();
        legendHeight = $('.uit-candidates__legend').height();
    },

    onScroll: function() {
        scrollTop = $(window).scrollTop();

        // add if at bottom of container

        if (scrollTop > $('.uit-candidates').offset().top + $('.uit-candidates').height() - legendHeight - 32) {
            $('.uit-candidates__legend').removeClass('is-fixed').addClass('was-fixed');
        } else if (scrollTop > $('.uit-candidates').offset().top) {
            $('.uit-candidates__legend').removeClass('was-fixed').addClass('is-fixed');
        } else {
            $('.uit-candidates__legend').removeClass('is-fixed was-fixed');
        }
    }
};
