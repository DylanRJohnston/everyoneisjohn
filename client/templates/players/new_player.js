Template.newPlayer.onRendered(function(){
    $('input[name=gameId]').val(this.data._id);
});

AutoForm.addHooks('insertPlayerForm', {
    onSubmit(doc) {
        this.event.preventDefault();
        Router.go('gamePage', {_id: doc.gameId});
        let _id = Players.insert(doc);
        this.done();
    }
});
