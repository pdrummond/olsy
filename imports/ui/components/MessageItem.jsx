import React from 'react';
import { browserHistory } from 'react-router';
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
import List from 'material-ui/lib/lists/list';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import FontIcon from 'material-ui/lib/font-icon';
import NewIcon from 'material-ui/lib/svg-icons/content/add-circle';
import SubjectDetailIcon from 'material-ui/lib/svg-icons/action/subject';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import EditIcon from 'material-ui/lib/svg-icons/image/edit';
import RemoveRedEye from 'material-ui/lib/svg-icons/image/remove-red-eye';
import Popover from 'material-ui/lib/popover/popover';
import { Subjects } from '../../api/subjects/subjects.js';

const style = {
    popover: {

    },
    menu: {
        marginRight: 32,
        marginBottom: 32,
        float: 'left',
        position: 'relative',
        zIndex: 0,
    },
    rightIcon: {
        textAlign: 'center',
        lineHeight: '24px',
    },
};

export default class MessageItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openSubjectPopover: false
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
                <div>
                    <span style={{cursor:'pointer', display:"flex", alignItems: 'center'}} onClick={(e) => { this.setState({openSubjectPopover:true, subjectPopoverAnchorEl: e.currentTarget})}}>
                        {this.renderSubjectIcon(subject)}
                        <span style={{marginLeft: '5px'}}> {this.props.projectKey}-{subject.seq}: </span>
                        <span style={{marginLeft: '5px'}}> {subject.title} </span>
                    </span>
                    <Popover
                        open={this.state.openSubjectPopover}
                        anchorEl={this.state.subjectPopoverAnchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={() => { this.setState({openSubjectPopover:false})}}
                        >
                        <div style={style.popover}>
                            <List subheader="Subject">
                                <MenuItem onTouchTap={() => {self.setState({openSubjectPopover:false}); browserHistory.push(`/project/${subject.projectId}/subject/${subject._id}`); }} primaryText="Focus on this subject" leftIcon={<RemoveRedEye />} />
                                <MenuItem onTouchTap={() => {self.setState({openSubjectPopover:false}); self.props.onSubjectSelected(subject)}} primaryText="Add message to this subject" leftIcon={<NewIcon />} />
                                <MenuItem primaryText="Edit Subject" leftIcon={<EditIcon />} />
                            </List>
                        </div>
                    </Popover>
                </div>
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
