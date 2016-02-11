Meteor.publish('games', function(gameId){

    //audit-arguments-check package doesn't understand the try catch block.
    check(arguments, Match.Any);
    try {
        check(this.userId, String);
        check(gameId, String);
    } catch (e) {
        this.ready();
        return;
    }

    return [Games.find({_id: gameId}), Notifications.find({gameId: gameId})];
});

Meteor.publish('allPlayers', function(gameId) {

    check(arguments, Match.Any);
    try {
        check(this.userId, String);
        check(gameId, String);
    } catch(e) {
        this.ready();
        return;
    }

    let projection = this.userId === Games.findOne({_id: gameId}).ownerId ? {} : {fields: {obsessions: 0}};

    return Players.find({gameId: gameId}, projection);
});

Meteor.publish('myPlayers', function(gameId) {

    check(arguments, Match.Any);
    try {
        check(this.userId, String);
        check(gameId, String);
    } catch(e) {
        this.ready();
        return;
    }
    return Players.find({gameId: gameId, ownerId: this.userId});
});
