Template.gamePage.onRendered(function(){
    $.material.init();
    MDSnackbars.init();
});

let isGameMaster = function(self) {
    return Meteor.userId() === self.ownerId;
};

let isJohn = function(self) {
    return Players.findOne({_id: self.johnId, gameId: self._id, ownerId: Meteor.userId()});
}

Template.gamePage.helpers({
    isGameMaster: function() {
        return isGameMaster(this);
    },
    players: function() {
        return Players.find({gameId: this._id});
    },
    rollName: function() {
        const names = {
            "check": "check.",
            "skilledCheck": "skilled check."
        };
        return names[this.gameState];
    },
    showWillPicker: function() {
        return (this.gameState === "check" || this.gameState === "skilledCheck") && (this.checkDifficulty != 0) && isJohn(this);
    },
    showDifficultySetter: function() {
        return (this.gameState === "check" || this.gameState === "skilledCheck") && isGameMaster(this);
    },
    showChallangePicker: function() {
        return (this.gameState === "challange" && Players.findOne({gameId: this._id, ownerId: Meteor.userId()}))
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
    },
    'click .input-number': function(e, t) {
        e.preventDefault();

        let game = Template.parentData(1);

        if (game.gameState === "check" || game.gameState === "skilledCheck") {
            if (isGameMaster(game)) {
                Meteor.call('setDifficulty', game._id, this.valueOf());
            } else if (isJohn(game)) {
                Meteor.call('useWillPower', game._id, game.johnId, this.valueOf());
            }
        } else if (game.gameState === "challange") {
            Meteor.call('betWillPower', game._id, Players.findOne({gameId: game._id, ownerId: Meteor.userId()})._id, this.valueOf());
        }
    }
});

Template.userPickNumber.helpers({
    range: function() {
        return _.range(this.lower, this.upper);
    }
})

Notifications.find({}).observe({
    added(doc) {
        MDSnackbars.show({
            text: doc.content,
            fullWidth: true,
            timeout: 10000,
            animation: 'slideup'
        });
    }
})
