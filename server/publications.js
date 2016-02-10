Meteor.publish('games', function(gameId){
    check(this.userId, String);
    check(gameId, String);

    return Games.find({_id: gameId});
});
