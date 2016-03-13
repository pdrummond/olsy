import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { Projects } from './projects.js';

const PROJECT_ID_ONLY = new SimpleSchema({
    projectId: { type: String },
}).validator();

const DEFAULT_THEME = 'blue';

export const insertProject = new ValidatedMethod({
    name: 'projects.insert',
    validate: new SimpleSchema({
        name: { type: String },
        isFavourite: { type: Boolean },
        userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true }
    }).validator(),
    run({name, isFavourite, userId}) {

        var project = {
            name,
            userId,
            isFavourite,
            order: Projects.find().count(),
            createdAt: new Date(),
            updatedAt: new Date(),
            theme: DEFAULT_THEME,
            key: name.substr(0, 3).toUpperCase()
        };
        console.log("Adding project: " + JSON.stringify(project, null, 2));
        return Projects.insert(project);
    }
});

export const updateIsFavourite = new ValidatedMethod({
    name: 'projects.updateIsFavourite',
    validate: new SimpleSchema({
        projectId: { type: String },
        isFavourite: { type: Boolean }
    }).validator(),
    run({projectId, isFavourite }) {
        console.log("> projects.updateIsFavourite");
        const project = Projects.findOne(projectId);

        if (!project.editableBy(this.userId)) {
            throw new Meteor.Error('projects.updateIsFavourite.accessDenied',
            'You don\'t have permission to edit this project.');
        }

        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

        var result = Projects.update(projectId, {
            $set: { isFavourite, updatedAt: new Date() },
        });
        console.log("project.updateIsFavourite: " + result);
    }
});

export const updateName = new ValidatedMethod({
    name: 'projects.updateName',
    validate: new SimpleSchema({
        projectId: { type: String },
        newName: { type: String },
    }).validator(),
    run({ projectId, newName }) {
        const project = Projects.findOne(projectId);

        if (!project.editableBy(this.userId)) {
            throw new Meteor.Error('projects.updateName.accessDenied',
            'You don\'t have permission to edit this project.');
        }

        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

        Projects.update(projectId, {
            $set: { name: newName },
        });
    },
});

export const removeProject = new ValidatedMethod({
    name: 'projects.remove',
    validate: PROJECT_ID_ONLY,
    run({ projectId }) {
        const project = Projects.findOne(projectId);

        if (!project.editableBy(this.userId)) {
            throw new Meteor.Error('projects.remove.accessDenied',
            'You don\'t have permission to remove this project.');
        }

        // XXX the security check above is not atomic, so in theory a race condition could
        // result in exposing private data

        if (project.isLastPublicProject()) {
            throw new Meteor.Error('projects.remove.lastPublicProject',
            'Cannot delete the last public project.');
        }

        Projects.remove(projectId);
    },
});
