import React from 'react';
import ReactDOM from 'react-dom';
import MessageItem from './MessageItem';

export default class MessageList extends React.Component {
    constructor(props) {
        super(props);
        var now = new Date();
    }

    render() {
        return (
            <div ref="messageList" className="message-list">
                {this.renderMessageItems()}
            </div>
        );
    }

    renderMessageItems() {
        var key=0;
        return this.props.messages.map(function(message) {
            return <MessageItem key={key++} message={message}/>;
        }.bind(this));
    }

    scrollBottom(callback) {
        console.log("scrollBottom");
        var self = this;
        setTimeout(function() {
            let node = ReactDOM.findDOMNode(self.refs.messageList);
            node.scrollTop = node.scrollHeight;
            if(callback) {
                callback();
            }
        }, 20);
    }

    scrollTop() {
        var self = this;
        setTimeout(function() {
            let node = ReactDOM.findDOMNode(self.refs.messageList);
            node.scrollTop = 0;
        }, 20);
    }

    isScrollBottom() {
        let node = ReactDOM.findDOMNode(this.refs.messageList);
        let atBottom = node.scrollHeight == node.scrollTop + node.clientHeight;
        console.log('isScrollBottom: ' + atBottom);
        return atBottom;

    }
}
