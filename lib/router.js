Router.configure({
    layoutTemplate: 'masterLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/game/:_id', {
    name: 'gamePage',
    waitOn: function() { return Meteor.subscribe('games', this.params._id) },
    data: function() { return Games.findOne(this.params._id) }
})


Router.route('/newGame', {
    name: 'newGame',
    template: 'newGame'
});

Router.route('/', {
    name: 'home',
});
