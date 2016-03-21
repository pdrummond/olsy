import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Streamy} from 'meteor/yuukan:streamy';
import { _ } from 'meteor/underscore';
import { Subjects } from '../subjects/subjects.js';
import { insertSubject } from '../subjects/subject-methods.js';
import { ServerMessages } from './server-messages.js';
import { displayError } from '../../ui/helpers/errors.js';
import {
validateMessage,
checkIfProjectIdIsValid
} from './server-message-validators';

const PAGE_SIZE = 30;

export const loadMessages = new ValidatedMethod({
    name: 'messages.loadMessages',
    validate: new SimpleSchema({
        projectId: { type: String, regEx: SimpleSchema.RegEx.Id},
        subjectId: { type: String, regEx: SimpleSchema.RegEx.Id, optional:true},
        seq: { type: Number, optional:true }
    }).validator(),
    run({seq, projectId, subjectId}) {
        console.log('> Loading page of messages in project ' + projectId);
        console.log('-- Starting seq is ' + seq);
        console.log('-- Subject is ' + subjectId);

        var query = {projectId};
        if(subjectId) {
            query.subjectId = subjectId;
        }

        /*
        If no seq is provided, then we need to return the latest page of results.
        */
        if (seq == null) {
            console.log('-- start message is 0 so finding latest page of messages...');
            var latestMessage = ServerMessages.findOne(query, {sort: {createdAt: -1}});
            if (latestMessage) {
                var latestSeq = latestMessage.seq;
                console.log('-- seq for latest message is ' + latestSeq);
                seq = (latestSeq - PAGE_SIZE) + 1;
                if (seq < 1) {
                    seq = 1;
                }
                console.log('-- start message seq for latest page is ' + seq);
            } else {
                seq = 1;
                console.log('-- There are no messages in this project so the seq is set to 1');
            }
        }

        query.seq =  {$gte: seq};

        console.log('-- Query is ' + JSON.stringify(query));

        /*
        This result structure is returned to the client.  It consists of the page of messages, and two booleans
        which define whether the back and forward links will be displayed.
        */

        var result = {
            showBackwardLink: false,
            showForwardLink: false,
            messages: []
        };

        /*
        Fetch a page of messages.  A page has a length of PAGE_SIZE and begins with the
        message seq = seq
        */
        result.messages = ServerMessages.find(query, {limit: PAGE_SIZE+1, sort: {seq: 1}}).fetch();
        console.log("-- Fetched " + result.messages.length + " messages for this page");

        //console.log('-- Latest page message is: ' + JSON.stringify(result.messages[result.messages.length-1], null, 4));

        /*
        Now we need to see if there are any older/newer messages than the current page in order to determine
        whether the back and forward links are shown.

        We only do this if there is no selected item.
        */

        if(result.messages && result.messages.length > 0) {
            var query = {projectId, seq: {$lt: result.messages[0].seq}};
            if(subjectId) {
                query.subjectId = subjectId;
            }
            var olderMessagesCount = ServerMessages.find(query).count();
            query = {projectId, seq: {$gt: result.messages[result.messages.length-1].seq}};
            if(subjectId) {
                query.subjectId = subjectId;
            }
            var newerMessagesCount = ServerMessages.find(query).count();

            result.showBackwardLink = olderMessagesCount > 0;
            result.showForwardLink = newerMessagesCount > 0;
        }

        console.log("< Load messages is DONE.");
        return result;
    }

});

export const insertMessage = new ValidatedMethod({
    name: 'messages.insertMessage',
    validate: new SimpleSchema({
        content: { type: String },
        username: { type: String},
        projectId: { type: String, regEx: SimpleSchema.RegEx.Id},
        subjectId: { type: String, regEx: SimpleSchema.RegEx.Id, optional:true},
        subjectTitle: { type: String, optional:true},
        subjectType: { type: String, optional:true}
    }).validator(),
    run({content, username, projectId, subjectId, subjectType, subjectTitle}) {
        console.log(`> messages.insertMessage()`)
        var message = {
            content,
            username,
            projectId,
            createdAt: new Date(),
            updatedAt: new Date(),
            seq: ServerMessages.find({projectId}).count()+1
        };
        validateMessage(this, message, [checkIfProjectIdIsValid]);

        if(subjectId) {
            console.log('-- existing subject id detected: ' + subjectId);
            var subject = Subjects.findOne(subjectId);
            if(!subject) {
                throw new Meteor.Error("messages.insertMessage.bad-subject", "subject id specified for message cannot be found: " + subjectId);
            }
            message.subjectId = subject._id;
            if(message.subjectId == null || message.subjectId.length == 0) {
                throw new Meteor.Error("messages.insertMessage.bad-subject", "Unexpected error associating message with subject - subjectId is bad");
            }
            console.log('-- successfully associated message with subject ' + message.subjectId);
        } else if(subjectTitle != null) {
            subjectTitle = subjectTitle.trim();
            if(subjectTitle.length > 0) {
                console.log('-- subject title detected: ' + subjectTitle);
                message.subjectId = insertSubject.call({
                    title: subjectTitle,
                    type: subjectType,
                    username,
                    projectId
                });
                if(message.subjectId == null || message.subjectId.length == 0) {
                    throw new Meteor.Error("messages.insertMessage.bad-subject", "Unexpected error creating subject - subjectTitle was provided, but subjectId is null");
                }
                console.log('-- successfully added subject ' + message.subjectId);
            }
        }
        //If message content is providd, then create message.  Note it's possible
        //for the subject to be created without an associated message if there is
        //no content and that's intentional.
        if(message.content != null && message.content.trim().length > 0) {
            message.content = message.content.trim();
            console.log("-- inserting message: " + JSON.stringify(message, null, 2));
            var messageId = ServerMessages.insert(message);

            /*var userIds = Members.find({projectId: message.projectId}).map(function (member) {
            return member.userId;
            });
            console.log("-- broadcasting message to " + userIds.length + " members: " + JSON.stringify(userIds));
            Streamy.sessionsForUsers(userIds).emit('incomingMessage', message);*/
            if(Meteor.isServer) {
                console.log("-- broadcasting message to all users");
                Streamy.broadcast('incomingMessage', message);
            }

            return messageId;
        }
    }
});
