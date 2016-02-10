Games = new Mongo.Collection('games');

let ownsGame = (userId, game) => game && game.ownerId === userId;

Games.allow({
    insert: () => true,
    update: (userId, game) => ownsGame(userId, game),
    remove: (userId, game) => ownsGame(userId, game)
});

Games.attachSchema(new SimpleSchema({
    title: {
        type: String,
        label: "Title",
        max: 50
    },
    obsessionCount: {
        type: Number,
        label: "Number of obsessions",
        min: 1,
        max: 5,
        defaultValue: 3
    },
    startingWillPower: {
        type: Number,
        label: "Starting Willpower",
        min: 1,
        max: 20,
        defaultValue: 10
    },
    betting: {
        type: Boolean,
        label: "Enable Betting",
        defaultValue: true
    },
    startingStory: {
        type: Boolean,
        label: "Generate random starting story",
        defaultValue: true
    },
    ownerId: {
        type: String,
        autoValue() {
            return this.userId;
        },
        autoform: {omit: true}
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return new Date();
            } else {
                this.unset();
            }
        },
        autoform: {omit: true}
    },
    gameState: {
        type: String,
        autoValue() {
            if (this.isInsert) return "running";
        },
        autoform: {omit: true}
    }
}));

const eventTypes = ['check', 'skilledCheck', 'challange'];

Meteor.methods({
    gameEvent: function(gameId, eventType) {
        check(Meteor.userId(), String);
        check(gameId, String);
        check(eventType, String);

        if (! eventTypes.some(type => type === eventType)) throw new Meteor.Error('invalid-type', 'The game event type was not in the list of allowable types.');

        let user = Meteor.userId();
        let game = Games.update({_id: gameId, ownerId: user}, {$set: {gameState: eventType}});

        console.log(gameId + ' ' + eventType + ' ' + user);

        if (! game) throw new Meteor.Error('invalid-call', 'The game either does not exist or the user does not own it.');
    }
})
