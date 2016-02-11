Template.newPlayer.onRendered(function(){
    $('input[name=gameId]').val(this.data._id);
});

AutoForm.hooks({
    insertPlayerForm: function() {
        console.log(this);
        Router.go('gamePage', {_id: this.gameId});
    }
})
