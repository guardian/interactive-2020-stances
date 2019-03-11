export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.uit-candidates__button').one('click', function(e) {
            e.preventDefault();
            this.expandCandidates();
        }.bind(this));
    },

    expandCandidates: function() {
        $('.uit-candidates__candidates.is-expandable').removeClass('uit-candidates__candidates--hidden');
        $('.uit-candidates__button').addClass('uit-candidates__button--clicked');
    }
};
