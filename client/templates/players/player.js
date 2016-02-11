Template.player.onRendered(function(){
    if (! this.data.obsessions) return;

    console.log(this);
    let content = Blaze.toHTMLWithData(Template.obsessions, this.data.obsessions);
    console.log(content)

    $(`#${this.data.name}-obsessions`).popover({
        container: 'body',
        placement: "left",
        html: true,
        trigger: 'focus',
        content: content
    });
});

let isJohn = function(self) {
    return Games.findOne({_id: self.gameId}).johnId === self._id;
};

Template.player.helpers({
    isJohn() {
        return isJohn(this);
    },
    playerClass() {
        return isJohn(this) ? 'panel-danger' : 'panel-primary';
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
    'click .obsession-popover': function(e, t) {
        $(e.target).popover('toggle');
    }
});

Template.obsessions.helpers({
    obsessionClass() {
        const colors = [
            '',
            'text-success',
            'text-warning',
            'text-danger'
        ];

        console.log(this.level + colors[this.level]);

        return colors[this.level];
    }
});
