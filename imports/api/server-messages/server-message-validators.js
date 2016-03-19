import { Meteor } from 'meteor/meteor';
import { ServerMessages } from './server-messages.js';
import { Projects } from '../projects/projects.js';

export function validateMessage(method, messageOrId, validatorFns) {
    var message;
    if(_.isObject(messageOrId)) {

        message = messageOrId;

        if(message == null) {
            throw new Meteor.Error(method.name + ".bad-data", "ServerMessage is null");
        }
    } else {

        message = ServerMessages.findOne(messageOrId);

        if(message == null) {
            throw new Meteor.Error(method.name + ".bad-data", "Cannot find message with id " + messageId);
        }
    }
    validatorFns.forEach(function(fn) {
        fn(method, message);
    });
    return message;
}

export function checkIfProjectIdIsValid(method, message) {
    var project = Projects.findOne(message.projectId);
    if (!project) {
        throw new Meteor.Error(method.name + ".bad-project", "Cannot find project for this message. Message project id is " + message.projectId);
    }
}
