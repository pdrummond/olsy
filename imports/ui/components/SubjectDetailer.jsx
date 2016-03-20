import React from 'react';
import { browserHistory } from 'react-router';
import Colors from 'material-ui/lib/styles/colors';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import BugIcon from 'material-ui/lib/svg-icons/action/bug-report';
import TaskIcon from 'material-ui/lib/svg-icons/alert/error';
import DiscussionIcon from 'material-ui/lib/svg-icons/communication/chat';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import Divider from 'material-ui/lib/divider';
import {parseMarkdown} from 'meteor/themeteorchef:commonmark';

import LabelChooser from './LabelChooser';

import { Subjects } from '../../api/subjects/subjects.js';

const styles = {
    button: {
        margin:'15px',
        marginRight:'50px'
    }
};

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left">
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);
const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>New</MenuItem>
        <MenuItem>In Progress</MenuItem>
        <MenuItem>Done</MenuItem>
    </IconMenu>
);

export default class SubjectDetailer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: Subjects.Type.SUBJECT_TYPE_DISCUSSION
        }
        this.handleSaveSelected = this.handleSaveSelected.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.subject) {
            this.setState({type: nextProps.subject.type});
        }
    }

    render() {

        return (
            <div>
                <List style={{backgroundColor: 'whitesmoke', borderBottom:'1px solid lightgray'}}>
                    <ListItem
                        primaryText={this.props.subject.title?<span>{this.props.projectKey}-{this.props.subject.seq}: {this.props.subject.title}</span> : ''}
                        leftAvatar={this.renderAvatar()}
                        rightIconButton={rightIconMenu}
                        secondaryText={
                            <div>
                                <span className="label">Release One</span> <span className="label">In Progress</span>
                            </div>
                        }
                        />
                </List>
                <div style={{padding:'30px'}}>
                    <Paper style={{padding:'10px'}}>
                        <div style={{display:'flex', padding:'0px 10px'}}>
                            <SelectField value={this.state.type} onChange={(e, idx, value) => {this.setState({type: value})}} floatingLabelText="Type">
                                <MenuItem value={'discussion'} primaryText="Discussion"/>
                                <MenuItem value={'task'} primaryText="Task"/>
                            </SelectField>
                            <AutoComplete
                                style={{marginLeft:'5px'}}
                                hintText="Enter a username"
                                floatingLabelText="Assignee"
                                filter={AutoComplete.fuzzyFilter}
                                triggerUpdateOnFocus={true}
                                dataSource={['pdrummond', 'harold']}
                                />
                        </div>
                        <LabelChooser/>
                        <div style={{float:'right', marginRight:'30px'}}>
                            <RaisedButton onTouchTap={this.close} label="Cancel" style={{marginRight:'5px'}}/>
                            <RaisedButton onTouchTap={this.handleSaveSelected}label="Save" primary={true}/>
                        </div>
                        <div style={{clear:'both', height:'10px'}}></div>
                    </Paper>
                </div>
                <div className="subject-detailer-buttonbar">
                    <RaisedButton label="New Message" secondary={true} style={styles.button} />
                    <RaisedButton label="Focus on this" style={styles.button} />
                    <RaisedButton label="Archive" primary={true} style={styles.button} />
                </div>
            </div>
        );
    }

    renderSubjectMessages() {
        var key=0;
        return this.props.subjectMessages.map(function(message) {
            return (
                <Card key={key++} className="subject-card">
                    <CardText>
                        <b>{message.username}</b><span style={{color:'gray'}}> 2 mins ago</span>
                        <div style={{marginTop:'10px'}} className="markdown-content" dangerouslySetInnerHTML={ this.getHtmlContent( message.content ) } />
                    </CardText>
                </Card>
            );
        }.bind(this));
    }

    getHtmlContent(content) {
        if ( content ) {
            return { __html: parseMarkdown(content) };
        }
    }

    renderAvatar() {
        switch(this.state.type) {
            case Subjects.Type.SUBJECT_TYPE_DISCUSSION: return <Avatar icon={<DiscussionIcon />} backgroundColor={Colors.cyan900} />;
            case Subjects.Type.SUBJECT_TYPE_TASK: return <Avatar icon={<TaskIcon />} backgroundColor={Colors.green700} />;
        }
    }

    handleSaveSelected() {
        this.props.onSaveSelected(this.props.subject, this.state.type);
        this.close();
    }

    close() {
        browserHistory.push(`/project/${this.props.subject.projectId}`);
    }
}
