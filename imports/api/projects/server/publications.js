import { Meteor } from 'meteor/meteor';

import { Projects } from '../projects.js';

Meteor.publish('projects.public', function projectsPublic() {
    return Projects.find({
        userId: { $exists: false },
    }, {
        fields: Projects.publicFields,
        sort: {updatedAt: -1, title:1}
    });
});

Meteor.publish('projects.current', function projectsCurrent(projectId) {
    console.log("PUBLISHING projects.current:" + projectId);
    return Projects.find({_id: projectId});
});
