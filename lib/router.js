Router.configure({
    layoutTemplate: 'masterLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/game/:_id/newPlayer', {
    name: 'newPlayer',
    waitOn: function() { return [
        Meteor.subscribe('games', this.params._id),
        Meteor.subscribe('allPlayers', this.params._id),
        Meteor.subscribe('myPlayers', this.params._id)
    ]},
    data: function() { return Games.findOne(this.params._id) }
});

Router.route('/game/:_id', {
    name: 'gamePage',
    waitOn: function() { return [
        Meteor.subscribe('games', this.params._id),
        Meteor.subscribe('allPlayers', this.params._id),
        Meteor.subscribe('myPlayers', this.params._id)
    ]},
    data: function() { return Games.findOne(this.params._id) }
})

Router.route('/newGame', {
    name: 'newGame',
    template: 'newGame'
});

Router.route('/', {
    name: 'home',
});

let requireLogin = function(){
    if (! Meteor.user()){
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

Router.onBeforeAction(requireLogin, {except: ['home']});
