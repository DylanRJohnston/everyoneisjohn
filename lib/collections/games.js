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
            if (this.isInsert) return this.userId;
            this.unset();
        },
        autoform: {omit: true}
    },
    johnId: {
        type: String,
        optional: true,
        autoform: {omit: true}
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) return new Date();
            this.unset();
        },
        autoform: {omit: true}
    },
    gameState: {
        type: String,
        autoValue() {
            if (this.isInsert) return "running";
        },
        autoform: {omit: true}
    },
    checkDifficulty: {
        type: Number,
        defaultValue: 6,
        allowedValues: [0, 1, 2, 3, 4, 5, 6],
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

        if (! game) throw new Meteor.Error('invalid-call', 'The game either does not exist or the user does not own it.');
    },
    setDifficulty: function(gameId, difficulty) {
        check(Meteor.userId(), String);
        check(gameId, String);
        check(difficulty, Number);

        let user = Meteor.userId();
        let game = Games.update({_id: gameId, ownerId: user, gameState: {$in: ["check", "skilledCheck"]}}, {$set: {checkDifficulty: difficulty}});

        if (! game) throw new Meteor.Error('invalid-call', 'The game either does not exist or the user does not own it.');
    },
    useWillPower: function(gameId, playerId, amount) {
        check(Meteor.userId(), String);
        check(playerId, String);
        check(gameId, String);
        check(amount, Number);

        let user = Meteor.userId();
        let player = Players.findOne({_id: playerId, ownerId: user, gameId: gameId});
        if (! player) throw new Meteor.Error('invalid-call', "The user calling this method is not the owner of the player in the game.");

        let game = Games.findOne({_id: gameId, johnId: player._id, checkDifficulty: {$gt: 0}, gameState: {$in: ["check", "skilledCheck"]}});
        if (! game) throw new Meteor.Error('invalid-call', "The game either does nto exist, the user is not john, or the game in not in the state check");

        let spendableWill = Math.min(amount, player.willpower);
        let skillBonus    = game.gameState === "skilledCheck" ? 3 : 0;
        let totalBonus    = spendableWill + skillBonus;

        Players.update({_id: player._id}, {$inc: {willpower: -1 * spendableWill}});

        if (Meteor.isServer) {
            let diceRoll = Math.floor(Math.random() * 6) + 1;
            if (diceRoll + totalBonus >= game.checkDifficulty) {
                createNotification(game._id, `Player ${player.name}, won the roll. Roll: ${diceRoll}, Will: ${spendableWill}, Skill: ${skillBonus}, >= Difficulty: ${game.checkDifficulty}`);
                Games.update({_id: game._id}, {$set: {gameState: "running", checkDifficulty: 0}});
            } else {
                createNotification(game._id, `Player ${player.name}, lost the roll. Roll: ${diceRoll}, Will: ${spendableWill}, Skill: ${skillBonus}, < Difficulty: ${game.checkDifficulty}`);
                Games.update({_id: game._id}, {$set: {johnId: "", gameState: "challange", checkDifficult: 0}});
            }
        }
    },
    betWillPower: function(gameId, playerId, willpower) {
        check(Meteor.userId(), String);
        check(gameId, String);
        check(playerId, String);
        check(willpower, Number);

        let user = Meteor.userId();
        let clampWillpower = Math.min(willpower, Players.findOne({_id: playerId, gameId: gameId, ownerId: user}, {_id: 0, willpower: 1}).willpower);

        let player = Players.update({_id: playerId, gameId: gameId, ownerId: user}, {$set: {bet: clampWillpower}});
        if (! player) throw new Meteor.Error('invalid-call', "The player either does not exist, is not part of this game, or is not owned by the calling user.");

        let allPlayerCount  = Players.find({gameId: gameId}).count();
        let finishedPlayers = Players.find({gameId: gameId, bet: {$exists: true}}, {sort: {bet: -1}});

        if (finishedPlayers.count() !== allPlayerCount) return;

        let winner = finishedPlayers.fetch()[0];
        createNotification(gameId, `Player ${winner.name} won the bet with ${winner.bet}.`);

        Players.update({_id: winner._id}, {$inc: {willpower: -1 * winner.bet}});
        Players.update({gameId: gameId}, {$unset: {bet: ""}}, {multi: true});
        Games.update({_id: gameId}, {$set: {johnId: winner._id, gameState: "running"}});
    }
})
