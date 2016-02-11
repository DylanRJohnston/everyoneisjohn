Template.newGame.onRendered(function() {
    $.material.init();
});

AutoForm.hooks({
    insertGameForm: {
        onSuccess: function(operation, result) {
            console.log(this);
            Router.go('gamePage', {_id: this.docId});
        }
    }
});
