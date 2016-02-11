ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1507471582892551',
    secret: Meteor.settings.private.facebookKey
});
