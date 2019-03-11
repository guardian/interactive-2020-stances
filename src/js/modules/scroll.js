let scrollTop, windowHeight;

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
    },

    onScroll: function() {
        scrollTop = $(window).scrollTop();

        // add if at bottom of container

        if (scrollTop > $('.uit-candidates').offset().top) {
            $('.uit-candidates__legend').addClass('is-fixed');
        } else {
            $('.uit-candidates__legend').removeClass('is-fixed');
        }
    }
};
