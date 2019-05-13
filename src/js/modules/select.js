let selectedCandidate = null;

export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.uit-issue__candidate').click(function(e) {
            this.selectCandidate(e.currentTarget);
        }.bind(this));
    },

    selectCandidate: function(el) {
        $('.uit-issue__candidate.is-selected').removeClass('is-selected');

        const newCandidate = $(el).data('id');

        if (newCandidate !== selectedCandidate) {
            selectedCandidate = newCandidate;
            $(`.uit-issue__candidate[data-id='${selectedCandidate}']`).addClass('is-selected');
        } else {
            selectedCandidate = null;
        }
    }
};
