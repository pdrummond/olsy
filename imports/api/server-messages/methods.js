import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Streamy} from 'meteor/yuukan:streamy';
import { _ } from 'meteor/underscore';

import { ServerMessages } from './server-messages.js';
/*import {
validateMessage,
checkIfUserCanEdit
} from './validators';

const MESSAGE_ID_ONLY = new SimpleSchema({
messageId: { type: String },
}).validator();*/

const PAGE_SIZE = 5;

export const loadMessages = new ValidatedMethod({
    name: 'messages.loadMessages',
    validate: new SimpleSchema({
        projectId: { type: String, regEx: SimpleSchema.RegEx.Id},
        seq: { type: Number, optional:true }
    }).validator(),
    run({seq, projectId}) {
        console.log('> Loading page of messages in project ' + projectId + ' starting at message ' + seq + '.');
        /*
        If no seq is provided, then we need to return the latest page of results.
        */
        if (seq == null) {
            console.log('-- start message is 0 so finding latest page of messages...');
            var latestMessage = ServerMessages.findOne({projectId}, {sort: {createdAt: -1}});
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
        result.messages = ServerMessages.find({projectId, seq: {$gte: seq}}, {limit: PAGE_SIZE+1, sort: {seq: 1}}).fetch();
        console.log("-- Fetched " + result.messages.length + " messages for this page");

        //console.log('-- Latest page message is: ' + JSON.stringify(result.messages[result.messages.length-1], null, 4));

        /*
        Now we need to see if there are any older/newer messages than the current page in order to determine
        whether the back and forward links are shown.

        We only do this if there is no selected item.
        */

        if(result.messages && result.messages.length > 0) {
            var olderMessagesCount = ServerMessages.find({
                projectId,
                seq: {$lt: result.messages[0].seq}
            }).count();

            var newerMessagesCount = ServerMessages.find({
                projectId,
                seq: {$gt: result.messages[result.messages.length-1].seq}
            }).count();

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
        projectId: { type: String, regEx: SimpleSchema.RegEx.Id}
    }).validator(),
    run({content, username, projectId}) {
        var message = {
            content,
            username,
            projectId,
            createdAt: new Date(),
            updatedAt: new Date(),
            seq: ServerMessages.find({projectId}).count()
        };
        //validateMessage(this, message, [checkIfProjectIdIsValid]);
        console.log("inserting message: " + JSON.stringify(message, null, 2));
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
});
