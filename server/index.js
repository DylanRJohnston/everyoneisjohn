Meteor.startup(function () {
  Players._ensureIndex({ gameId: 1});
  Players._ensureIndex({ ownerId: 1});
  Games._ensureIndex({ johnId: 1 });
});
