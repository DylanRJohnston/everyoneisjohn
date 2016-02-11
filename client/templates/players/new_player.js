Template.newPlayer.onRendered(function(){
    $('input[name=gameId]').val(this.data._id);
});

// AutoForm.hooks({
//     insertPlayerForm: function() {
//         Router.go('gamePage', {_id: this.gameId});
//     }
// });

AutoForm.hooks({
    insertPlayerForm: {
        onSuccess: function(operation, result) {
            Router.go('gamePage', {_id: this.insertDoc.gameId});
        }
    }
});
