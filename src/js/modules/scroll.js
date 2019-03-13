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

        if (scrollTop > $('.uit-candidates__overview').offset().top + $('.uit-candidates__overview').height() - $('.uit-candidates__legend.is-visible').height()) {
            $('.uit-candidates__legend').removeClass('is-fixed').addClass('was-fixed');
        } else if (scrollTop > $('.uit-candidates__overview').offset().top) {
            $('.uit-candidates__legend').removeClass('was-fixed').addClass('is-fixed');
        } else {
            $('.uit-candidates__legend').removeClass('is-fixed was-fixed');
        }
    }
};
