let selectedCandidate = null;

export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.uit-issue__candidate').click(function(e) {
            if ($(window).width() >= 768) {
                this.selectCandidate(e.currentTarget);
            }
        }.bind(this));
    },

    selectCandidate: function(el) {
        $('.uit-issue__candidate.is-selected').removeClass('is-selected');
        $('.uit').removeClass('has-selection');

        const newCandidate = $(el).data('id');

        if (newCandidate !== selectedCandidate) {
            selectedCandidate = newCandidate;
            $(`.uit-issue__candidate[data-id='${selectedCandidate}']`).addClass('is-selected');
            $('.uit').addClass('has-selection');
        } else {
            selectedCandidate = null;
        }
    }
};
