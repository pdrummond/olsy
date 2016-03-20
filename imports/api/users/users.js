import { Accounts } from 'meteor/accounts-base';

import {Projects } from '../projects/projects.js';

import {
    insertProject
} from '../projects/project-methods.js';

Accounts.onCreateUser(function(options, user) {
    console.log("onCreateUser: " + JSON.stringify(user, null, 2));
    var email;
    if(user.emails) {
        email = user.emails[0].address;
    }

    console.log("Creating a default project for user..." );
    const projectId = insertProject.call({
        name: user.username,
        key: user.username,
        username: user.username
    });
    user.projectId = projectId;
    console.log("User's default project created: " + user.projectId);

    // We still want the default hook's 'profile' behavior.
    if (options.profile) {
        user.profile = options.profile;
    }
    return user;
});
