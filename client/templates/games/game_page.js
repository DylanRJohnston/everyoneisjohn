Template.gamePage.onRendered(() => $.material.init());

Template.gamePage.helpers({
    isGameMaster: function() {
        return Meteor.userId() === this.ownerId;
    }
});

Template.gamePage.events({
    'click #check': function(e, t) {
        e.preventDefault();
        Meteor.call('gameEvent', this._id, 'check');
    },
    'click #skilledCheck': function(e, t) {
        e.preventDefault();
        Meteor.call('gameEvent', this._id, 'skilledCheck');
    },
    'click #challange': function(e, t) {
        e.preventDefault();
        Meteor.call('gameEvent', this._id, 'challange');
    }
})
