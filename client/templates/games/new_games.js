Template.newGame.onRendered(function() {
    $.material.init();
});

//We optimistically navigate to the next page.
//Using onSuccess would wait for the server before navigating
AutoForm.addHooks('insertGameForm', {
    onSubmit(doc) {
        this.event.preventDefault();
        let _id = Games.insert(doc);
        this.done();
        Router.go('gamePage', {_id: _id});
    }
});
