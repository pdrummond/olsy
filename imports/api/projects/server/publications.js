import { Meteor } from 'meteor/meteor';

import { Projects } from '../projects.js';

Meteor.publish('projects.public', function projectsPublic() {
    return Projects.find({
        userId: { $exists: false },
    }, {
        fields: Projects.publicFields,
        sort: {order:1, title:1}
    });
});
