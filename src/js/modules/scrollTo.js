let touchTimer;

export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.uit-body a[href^="#"]').click(function(e) {
            e.preventDefault();
            this.scrollTo(e.currentTarget.hash);
        }.bind(this));
    },

    scrollTo: function(id) {
        document.getElementById(id.replace('#', '')).scrollIntoView({
            behavior: 'smooth'
        });
    }
};
