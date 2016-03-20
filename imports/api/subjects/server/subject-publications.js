import { Meteor } from 'meteor/meteor';

import { Subjects } from '../subjects.js';

Meteor.publish('subjects.project', function(projectId) {
    return Subjects.find({projectId}, {
        fields: Subjects.publicFields,
        sort: {updatedAt: -1, title:1}
    });
});

Meteor.publish('subjects.current', function(subjectId) {
    console.log("PUBLISHING subjects.current:" + subjectId);
    return Subjects.find({_id: subjectId});
});
