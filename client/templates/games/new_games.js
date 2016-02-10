Template.newGame.onRendered(function() {
    $.material.init();
});

AutoForm.hooks({
    insertGameForm: function() {
        Router.go('gamePage', {_id: this.docId});
    }
})
