import { Meteor } from 'meteor/meteor';

Meteor.publish('users.data', function () {
    console.log("PUBLISHING users.data");
    return Meteor.users.find({}, {fields: { _id: 1, username: 1, projectId: 1 }});
});
