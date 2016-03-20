import React from 'react';
import MessageList from './MessageList';
import { displayError } from '../helpers/errors.js';
import { ClientMessages } from '../../api/client-messages/client-messages.js';
import { Streamy} from 'meteor/yuukan:streamy';

import {
    loadMessages
} from '../../api/server-messages/server-message-methods.js';

export default class MessageHistory extends React.Component {
    constructor(props) {
        console.log("> MessageHistory ctor");
        super(props);
        this.state = {
            currentProject: {
                name: ''
            },
            messages:[],
            newMessages:[],
            incomingMessageCount:0
        }

        this.handleIncomingMessage();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.currentProject._id !== nextProps.currentProject._id) {
            console.log("project has changed - loading messages");
            this.setState({currentProject: nextProps.currentProject});
            this.loadMessages(nextProps.currentProject._id);
        }
    }

    render() {
        return (
            <div className="message-history" style={this.props.style}>
                <MessageList
                    ref="messageList"
                    className="message-list"
                    messages={this.state.messages}
                    projectKey={this.state.currentProject.key}
                    onSubjectSelected={this.props.onSubjectSelected}
                    />
            </div>
        );
    }

    loadMessages(projectId) {
        console.log(`> loadMessages(${projectId})`);
        loadMessages.call({projectId}, function(err, result) {
            if(err) {
                displayError(err);
            } else {
                ClientMessages._collection.remove({});
                _.each(result.messages, function (message) {
                    ClientMessages.insert(message);
                });
                var clientMessages = ClientMessages.find({}, {sort: {seq: 1}}).fetch();
                this.setState({messages: clientMessages, showBackwardLink: result.showBackwardLink, showForwardLink: result.showForwardLink});
            }
        }.bind(this));
        var count = ClientMessages.find({}).count();
        console.log("loaded " + count + " messages");
    }

    handleIncomingMessage() {
        Streamy.on('incomingMessage', function(msg) {
            console.log("incoming message received: " + JSON.stringify(msg, null, 4));

            /*
                When a new message arrives we need to determine if it lives in the current project.  If not, then
                it's a new message for another project and we need to show a notification badge in the left-sidebar.

                If it is for this project, then if the user is at the end of the history, then we can just add the
                msg, but if the user has scrolled back, we don't want to affect their position, so we show a
                "New Messages" toast instead.

                We also need to check for "detail mode" - if the message history is only showing the messages for
                one task, then being in the same project isn't good enough - we need to check that the message contains
                a ref to the item.  Rather than check the Refs collection which would be quite heavyweight, we just
                use a string comparison to test for the ref.  That is, unless the message is an activity message, in
                which case it will already have an itemId so we can just check for that instead.
             */
            var ok = false;
            if(msg.projectId == this.props.currentProject._id) {
                //var incomingMessageCount = 0;
                /*if (this.isInScrollBack()) {// && msg.createdBy != Meteor.userId()) {
                    incomingMessageCount = this.state.incomingMessageCount || 0;
                    this.setState({newMessages: this.state.newMessages.concat([msg]), incomingMessageCount: incomingMessageCount + 1});
                } else {*/
                    /*
                     Might need to improve this - it works for now but not ideal.

                     Basically, we want to add the incoming message if it wasn't a chat message
                     created by the current user, because in that situation the message is added by the user
                     instantly before the server round-trip.  But if the chat message is from another user we
                     want to add it, and if the message is NOT a chat message then we want to add it.

                     But "not a chat message" isn't really the correct logic.  Really, we want to distinguish between
                     messages that originated on the client and messages that originate on the server.  If on the server
                     we want to display them, if on the client, then the client will take care of adding them so we
                     don't have to do it here.

                     Need to think about this some more as I work on the app, then at some point hopefully I'll do the
                     right thing here.
                     */
                    //if (msg.messageType != Ols.MESSAGE_TYPE_CHAT || msg.createdBy != Meteor.userId()) {
                        this.setState({incomingMessageCount: 0, messages: this.state.messages.concat([msg])});
                        this.scrollBottom();
                    //}
                //}
            } else {
                //this.props.onOtherProjectNewMessage(msg);
            }
        }.bind(this));
    }

    isInScrollBack() {
        var inScrollBack = false;
        if(!inScrollBack) {
            /*
             If showing latest messages, but user has scrolled up then
             this is also considered 'scroll back' so check for this here
             */
            inScrollBack = !this.refs.messageList.isScrollBottom();
        }
        return inScrollBack;
    }

    scrollBottom(callback) {
        this.refs.messageList.scrollBottom(callback);
        this.setState({ incomingMessageCount: 0});
    }

    scrollTop() {
        this.refs.messageList.scrollTop();
    }
}
