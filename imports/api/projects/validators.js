import { Meteor } from 'meteor/meteor';
import { Projects } from './projects.js';

export function validateProject(method, projectOrId, validatorFns) {
    var project;
    if(_.isObject(projectOrId)) {

        project = projectOrId;

        if(project == null) {
            throw new Meteor.Error(method.name + ".bad-data", "Project is null");
        }
    } else {

        project = Projects.findOne(projectOrId);

        if(project == null) {
            throw new Meteor.Error(method.name + ".bad-data", "Cannot find project with id " + projectId);
        }
    }
    validatorFns.forEach(function(fn) {
        fn(method, project);
    });
    return project;
}

export function checkIfUserCanEdit(method, project) {
    if (!project.editableBy(this.userId)) {
        throw new Meteor.Error(method.name + ".not-authorised", "You don't have permission to edit this project.");
    }
}

export function checkIfProjectKeyIsUnique(method, project) {
    if(Projects.findOne({key: project.key})) {
        throw new Meteor.Error(method.name + ".duplicate-key", "A project already existing with key " + project.key);
    }
}

export function checkIfLastPublicProject(method, project) {
    if (project.isLastPublicProject()) {
        throw new Meteor.Error(method.name + '.last-public-project', 'Cannot delete the last public project.');
    }
}
