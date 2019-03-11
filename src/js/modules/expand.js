export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.uit-candidates__button').click(function(e) {
            e.preventDefault();
            this.changeButtonState();
        }.bind(this));
    },

    changeButtonState: function() {
        const isHidden = $('.uit-candidates__candidates.is-expandable').hasClass('uit-candidates__candidates--hidden');

        if (isHidden) {
            $('.uit-candidates__candidates.is-expandable').removeClass('uit-candidates__candidates--hidden');
        } else {
            $('.uit-candidates__candidates.is-expandable').addClass('uit-candidates__candidates--hidden');
        }
    }
};
