import React from 'react';
import MessageList from './MessageList'

export default class MessageHistory extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="message-history">
                <MessageList className="message-list"/>
            </div>
        );
    }
}
