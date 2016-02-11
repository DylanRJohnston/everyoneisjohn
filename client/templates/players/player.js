Template.player.onRendered(function(){
    if (! this.data.obsessions) return;

    let content = Blaze.toHTMLWithData(Template.obsessions, this.data.obsessions);

    $(`#${this.data.name}-obsessions`).popover({
        container: 'body',
        placement: "left",
        html: true,
        trigger: 'focus',
        content: content
    });
});

Template.player.helpers({
    isJohn() {
        return Games.findOne({_id: this.gameId}).johnId === this._id;
    },
    playerClass() {
        return Games.findOne({_id: this.gameId}).johnId === this._id ? 'panel-danger' : 'panel-primary';
    },
    skillPrefix(name, index) {
        const prefixes = [
            `${name} enjoys `,
            `and `,
            'but sometimes '
        ];

        return prefixes[index];
    }
});

Template.player.events({
    'click .panel-heading': function(e, t) {
        t.$('span[data-toggle="popover"]').popover('toggle');
    }
});

Template.obsessions.helpers({
    obsessionClass() {
        const colors = [
            '',
            'bg-success',
            'bg-warning',
            'bg-danger'
        ];

        return colors[this.level];
    }
});
