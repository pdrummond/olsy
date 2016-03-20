import React from 'react';
import ReactDOM from 'react-dom';
import ProseMirror from 'react-prosemirror';
import 'prosemirror/dist/menu/tooltipmenu';
import 'prosemirror/dist/markdown'

import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Divider from 'material-ui/lib/divider';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close';
import DiscussionIcon from 'material-ui/lib/svg-icons/communication/chat';
import BugIcon from 'material-ui/lib/svg-icons/action/bug-report';
import TaskIcon from 'material-ui/lib/svg-icons/alert/error';
import Colors from 'material-ui/lib/styles/colors';
import Badge from 'material-ui/lib/badge';
import Popover from 'material-ui/lib/popover/popover';
import RaisedButton from 'material-ui/lib/raised-button';

import SubjectField from './SubjectField';

import { Subjects } from '../../api/subjects/subjects.js';

const styles = {
    popover: {
        padding: 20,
    },
};

export default class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectType: Subjects.Type.SUBJECT_TYPE_DISCUSSION,
            subjectTitle: '',
            content: ""
        }
        this.handleClearSubject = this.handleClearSubject.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.onSendMessageSelected = this.onSendMessageSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.selectedSubject) {
            this.setState({selectedSubject: nextProps.selectedSubject});
        }
    }

    onContentChange(content) {
        this.setState({content})
    }

    render() {
        console.trace("MessageBox.render()");
        return (
            <div className="message-box" style={{width:this.props.fullWidth?'100%':'calc(100% - 600px)'}}>
                <Paper zDepth={1} style={{padding:'0px 20px 10px 20px', backgroundColor:'whitesmoke'}}>
                    <span style={{display:'flex', alignItems: 'flex-end'}}>
                        <IconMenu
                            iconButtonElement={this.renderSubjectType()}
                            tabIndex={-1}>
                            <MenuItem primaryText="Discussion" leftIcon={<DiscussionIcon/>} onTouchTap={() => { this.handleClearSubject({subjectType: Subjects.Type.SUBJECT_TYPE_DISCUSSION}) } }/>
                            <MenuItem primaryText="Task" leftIcon={<TaskIcon/>} onTouchTap={() => { this.handleClearSubject({subjectType: Subjects.Type.SUBJECT_TYPE_TASK}) } }/>
                        </IconMenu>
                        <TextField
                            value={this.state.selectedSubject?this.state.selectedSubject.title: this.state.subjectTitle}
                            onChange={(e) => {this.handleClearSubject({subjectTitle: e.target.value})}}
                            floatingLabelText="Subject" hintText="Enter Subject here (optional)" fullWidth={true}/>
                        <FlatButton
                            disabled={true}
                            title={this.state.selectedSubject?"This is the key for the selected subject":"This is a new subject"}
                            label={this.state.selectedSubject?`${this.props.projectKey}-${this.state.selectedSubject.seq}`:"New"}/>
                        <IconButton tooltip="Clear Subject" tooltipPosition="top-center" style={{position:'relative', top:'5px'}} onTouchTap={this.handleClearSubject} tabIndex={-1}><CloseIcon/></IconButton>
                        <IconMenu style={{position:'relative', top:'5px'}} tabIndex={-1}
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            >
                            <MenuItem primaryText="Clear Subject" />
                            <MenuItem primaryText="Choose Subject" />
                        </IconMenu>

                    </span>
                    <br/>
                    <div className="markdown-content">
                        <ProseMirror value={this.state.content} onChange={this.onContentChange} options={{docFormat: 'markdown', tooltipMenu: {selectedBlockMenu:true}}} />
                    </div>
                    <br/>
                    <div style={{textAlign:'right', position:'relative', top:'5px'}}>
                        <FlatButton label="Cancel" onClick={this.props.onCancelMessageSelected}/>
                        <FlatButton label="Send Message" onClick={this.onSendMessageSelected} primary={true} />
                    </div>
                </Paper>
            </div>
        );
    }

    onSendMessageSelected() {
        var subjectId = null;
        var subjectTitle = this.state.subjectTitle;
        var subjectType = this.state.subjectType;

        if(this.state.selectedSubject) {
            subjectId = this.state.selectedSubject._id;
            subjectTitle = this.state.selectedSubject.title;
            subjectType = this.state.selectedSubject.type;
        }
        this.setState({content: ''}); //clear down content for next message but keep subject around so it can be re-used.
        this.props.onSendMessageSelected(this.state.content, subjectId, subjectTitle, subjectType);
    }

    handleClearSubject(extraState) {
        this.setState(_.extend({selectedSubject: null, subjectTitle: '', subjectType: Subjects.Type.SUBJECT_TYPE_DISCUSSION}, extraState));
    }

    renderSubjectType() {
        var subjectType = this.state.selectedSubject?this.state.selectedSubject.type:this.state.subjectType;
        switch(subjectType) {
            case Subjects.Type.SUBJECT_TYPE_DISCUSSION: return <IconButton><DiscussionIcon color={Colors.cyan900}/></IconButton>;
            case Subjects.Type.SUBJECT_TYPE_TASK: return <IconButton><TaskIcon color={Colors.green700}/></IconButton>;
        }
    }
}
