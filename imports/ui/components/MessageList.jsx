import React from 'react';
import MessageItem from './MessageItem';

export default class MessageList extends React.Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.messageItems = [{
            _id: 1,
            username: 'pdrummond',
            subject: 'OLS-42: Should Message History items be cards to prompte the idea of medium-form content',
            content: "I actually don't want to promote lots of one-liners.  I want it to be like a real-time list of emails if you like.  What about replies though?  Should it be possible to reply to a message?",
            createdAt: now,
            updatedAt: now,
            seq: 1
        }, {
            _id: 2,
            username: 'harold',
            subject: 'OLS-10: [BUG] The sidebar isn\'t working properly',
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium nunc augue, ut tincidunt est faucibus ut. Nulla viverra neque sed leo scelerisque, sed viverra nibh molestie. Ut lacus justo, laoreet sit amet massa sit amet, sollicitudin auctor diam. Mauris porttitor metus dolor, a tristique nisi vulputate et. Nulla viverra arcu vel interdum dignissim. Mauris consequat malesuada sem, vitae cursus nibh bibendum ullamcorper. Nunc eleifend, mauris nec gravida efficitur, libero diam tempor metus, vel sollicitudin leo nisl nec justo. Ut quis lacinia velit, id lacinia mauris. Maecenas volutpat, nunc eget luctus mollis, mauris sapien blandit arcu, imperdiet egestas nisi ante vitae tortor. Maecenas ac consectetur mauris. Maecenas aliquam, lorem nec finibus efficitur, sapien nibh consequat ex, vel pretium nisi tellus eget ex. Proin at tempor elit.",
            createdAt: now,
            updatedAt: now,
            seq: 2
        }];
    }

    render() {
        return (
            <div className="message-list">
                {this.renderMessageItems()}
            </div>
        );
    }

    renderMessageItems() {
        return this.messageItems.map(function(message) {
            return <MessageItem key={message._id} message={message}/>;
        }.bind(this));
    }
}
