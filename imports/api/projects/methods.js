import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { Projects } from './projects.js';
import {
    validateProject,
    checkIfUserCanEdit,
    checkIfProjectKeyIsUnique,
    checkIfLastPublicProject
} from './validators';

const PROJECT_ID_ONLY = new SimpleSchema({
    projectId: { type: String },
}).validator();

const DEFAULT_THEME = 'blue';

export const insertProject = new ValidatedMethod({
    name: 'projects.insertProject',
    validate: new SimpleSchema({
        name: { type: String },
        key: { type: String },
        isFavourite: { type: Boolean, optional:true, defaultValue:false },
        userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true }
    }).validator(),
    run({name, key, isFavourite, userId}) {
        var project = {
            name,
            userId,
            isFavourite,
            order: Projects.find().count(),
            createdAt: new Date(),
            updatedAt: new Date(),
            theme: DEFAULT_THEME,
            key: key || name.substr(0, 3).toUpperCase()
        };
        validateProject(this, project, [checkIfProjectKeyIsUnique]);
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
        validateProject(this, projectId, [checkIfUserCanEdit]);
        var result = Projects.update(projectId, {
            $set: { isFavourite, updatedAt: new Date() },
        });
    }
});

export const updateName = new ValidatedMethod({
    name: 'projects.updateName',
    validate: new SimpleSchema({
        projectId: { type: String },
        newName: { type: String },
    }).validator(),
    run({ projectId, newName }) {
        const project = validateProject(this, projectId, [checkIfUserCanEdit]);
        Projects.update(projectId, {
            $set: { name: newName },
        });
    },
});

export const removeProject = new ValidatedMethod({
    name: 'projects.removeProject',
    validate: PROJECT_ID_ONLY,
    run({ projectId }) {
        const project = validateProject(this, projectId, [checkIfUserCanEdit, checkIfLastPublicProject]);
        Projects.remove(projectId);
    },
});
