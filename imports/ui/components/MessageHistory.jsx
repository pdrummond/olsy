import React from 'react';
import MessageList from './MessageList'
import MessageBox from './MessageBox'

export default class MessageHistory extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="message-history">
                <MessageList className="message-list"/>
                <MessageBox className="message-box"/>
            </div>
        );
    }
}
