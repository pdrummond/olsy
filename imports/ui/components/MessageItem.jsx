import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import Toggle from 'material-ui/lib/toggle';
import Avatar from 'material-ui/lib/avatar';
import Colors from 'material-ui/lib/styles/colors';
import {parseMarkdown} from 'meteor/themeteorchef:commonmark';
import BugIcon from 'material-ui/lib/svg-icons/action/bug-report';
import TaskIcon from 'material-ui/lib/svg-icons/alert/error';
import DiscussionIcon from 'material-ui/lib/svg-icons/communication/chat';

import { Subjects } from '../../api/subjects/subjects.js';

export default class MessageItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        };
        this.handleExpandChange = this.handleExpandChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleReduce = this.handleReduce.bind(this);
    }

    handleExpandChange(expanded) {
        this.setState({expanded: expanded});
    };

    handleToggle(event, toggle) {
        this.setState({expanded: toggle});
    };

    handleExpand() {
        this.setState({expanded: true});
    };

    handleReduce() {
        this.setState({expanded: false});
    };

    render() {
        return (
            <Card className="message-item" expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardHeader
                    title={this.props.message.username}
                    subtitle={this.renderSubject()}
                    avatar={<Avatar>{this.props.message.username.substr(0, 2)}</Avatar>}
                    />
                <CardText style={{padding:'0px 15px 15px 15px', fontSize:'16px', fontWeight: '300'}}>
                    <div className="markdown-content" dangerouslySetInnerHTML={ this.getHtmlContent( this.props.message.content ) } />
                </CardText>
            </Card>
        );
    }

    renderSubject() {
        var self = this; //Why do I need self here?  I should be able to use 'this' in an arrow function right?
        if(this.props.message.subjectId) {
            var subject = Subjects.findOne(this.props.message.subjectId);
            return (
                <span style={{cursor:'pointer', display:"flex", alignItems: 'center'}} onClick={() => { self.props.onSubjectSelected(subject)}}>
                    {this.renderSubjectIcon(subject)}
                    <span style={{marginLeft: '5px'}}> {subject.title} </span>
                    <span style={{marginLeft: '5px', color:'lightgray'}}> {this.props.projectKey}-{subject.seq}</span>
                </span>
            );
        } else {
            return <span>No Subject</span>;
        }
    }

    renderSubjectIcon(subject) {
        switch(subject.type) {
            case Subjects.Type.SUBJECT_TYPE_DISCUSSION: return <DiscussionIcon color={Colors.cyan900} style={{width:'20px'}}/>;
            case Subjects.Type.SUBJECT_TYPE_TASK: return <TaskIcon color={Colors.green700} style={{width:'20px'}}/>;
        }
    }

    getHtmlContent(content) {
        if ( content ) {
            return { __html: parseMarkdown(content) };
        }
    }
}
