Notifications = new Mongo.Collection('notifications');

Notifications.attachSchema(new SimpleSchema({
    gameId: {
        type: String
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) return new Date();
            this.unset();
        }
    }
}));

createNotification = function(gameId, content) {
    let notification = {
        gameId: gameId,
        content: content
    };

    notification._id = Notifications.insert(notification);

    Meteor.setTimeout(() => Notifications.remove(notification._id), 5000);
}
