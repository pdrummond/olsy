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
                    actAsExpander={true}
                    showExpandableButton={true}
                    />
                <CardText style={{padding:'0px 15px 15px 15px', fontSize:'16px', fontWeight: '300'}}>
                    <div className="markdown-content" dangerouslySetInnerHTML={ this.getHtmlContent( this.props.message.content ) } />
                </CardText>
                <CardMedia
                    expandable={true}
                    overlay={<CardTitle title="My Photo" subtitle="I took this while on holiday" />}>
                    <img src="http://lorempixel.com/600/337/nature/" />
                </CardMedia>
            </Card>
        );
    }

    renderSubject() {
        if(this.props.message.subjectId) {
            var subject = Subjects.findOne(this.props.message.subjectId);
            return (
                <span style={{display:"flex", alignItems: 'center'}}>
                    <DiscussionIcon color={Colors.cyan900} style={{width:'20px'}}/>
                    <span style={{marginLeft: '5px'}}> {subject.title} </span>
                    <span style={{marginLeft: '5px', color:'lightgray'}}> OLS-6</span>
                </span>
            );
        } else {
            return <span>No Subject</span>;
        }
    }

    getHtmlContent(content) {
        if ( content ) {
            return { __html: parseMarkdown(content) };
        }
    }
}
