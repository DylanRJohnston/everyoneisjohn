Players = new Mongo.Collection('players');

let ownsPlayer = (userId, player) => player && player.ownerId === userId;

Players.allow({
    insert: () => true,
    // update: (userId, player) => ownsPlayer(userId, player),
    // remove: (userId, player) => ownsPlayer(userId, player)
});

Players.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 50
    },
    gameId: {
        type: String,
        autoform: {type: 'hidden', label: false}
    },
    skills: {
        type: [String],
        label: "Skills",
        minCount: 2,
        maxCount: 3
    },
    obsessions: {
        type: [Object],
        label: "Obsessions",
        custom() {
            return this.value.length === Games.findOne({_id: this.field('gameId').value}).obsessionCount;
        }
    },
    'obsessions.$.description': {
        type: String,
        label: "Description"
    },
    'obsessions.$.level': {
        type: Number,
        label: "Level",
        allowedValues: [1, 2, 3]
    },
    willpower: {
        type: Number,
        autoValue() {
            if (this.isInsert) {
                return Games.findOne({_id: this.field('gameId').value}).startingWillPower - (this.field('skills').value.length - 2) * 3;
            } else if (! this.isFromTrustedCode) {
                this.unset();
            }
        },
        autoform: {omit: true}
    },
    bet: {
        type: Number,
        defaultValue: -1,
        autoform: {omit: true}
    },
    ownerId: {
        type: String,
        autoValue() {
            if (this.isInsert) return this.userId;
            this.unset();
        },
        autoform: {omit: true}
    },
    createAt: {
        type: Date,
        autoform: {omit: true},
        autoValue() {
            return new Date();
        }
    }

}));
