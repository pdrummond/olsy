import React from 'react';
import ReactDOM from 'react-dom';
import ProseMirror from 'react-prosemirror';
import 'prosemirror/dist/menu/tooltipmenu';
import 'prosemirror/dist/markdown'

import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
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
            popOverOpen: false,
            subjectType: Subjects.Type.SUBJECT_TYPE_DISCUSSION,
            subjectTitle: '',
            subjectSeq: null,
            subjectId: null,
            content: ""
        }
        this.handleSubjectSelected = this.handleSubjectSelected.bind(this);
        this.handleClearSubject = this.handleClearSubject.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.onSendMessageSelected = this.onSendMessageSelected.bind(this);
    }

    onContentChange(content) {
        this.setState({content})
    }

    render() {
        console.log("MessageBox.render()");
        return (
            <div className="message-box" style={{width:this.props.fullWidth?'100%':'calc(100% - 600px)'}}>
                <Paper zDepth={1} style={{padding:'0px 20px 10px 20px', backgroundColor:'whitesmoke'}}>
                    <span style={{display:'flex', alignItems: 'flex-end'}}>
                        <IconMenu
                            iconButtonElement={this.renderSubjectType()} >
                            <MenuItem primaryText="Discussion" leftIcon={<DiscussionIcon/>} onTouchTap={() => { this.setState({subjectType: Subjects.Type.SUBJECT_TYPE_DISCUSSION}) } }/>
                            <MenuItem primaryText="Task" leftIcon={<TaskIcon/>} onTouchTap={() => { this.setState({subjectType: Subjects.Type.SUBJECT_TYPE_TASK}) } }/>
                        </IconMenu>
                        <SubjectField                            
                            onSubjectSelected={this.handleSubjectSelected}
                            subjects={this.props.subjects}/>
                        <FlatButton ref='keyButton'
                            title="This is a new subject"
                            label={this.state.subjectId?`${this.props.projectKey}-${this.state.subjectSeq}`:"New"}
                            onTouchTap={(e) => {this.setState({popOverOpen: !this.state.popoverOpen, popOverAnchorEl:e.currentTarget})}}/>
                        <Popover
                            open={this.state.popOverOpen}
                            anchorEl={this.state.popOverAnchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={() => { this.setState({popoverOpen: false}); }}>
                            <div style={styles.popover}>
                                <RaisedButton primary={true} label="Clear subject" onTouchTap={this.handleClearSubject}/>
                            </div>
                        </Popover>
                    </span>
                    <br/>
                    <ProseMirror value={this.state.content} onChange={this.onContentChange} options={{docFormat: 'markdown', tooltipMenu: {selectedBlockMenu:true}}} />
                    <br/>
                    <div style={{textAlign:'right', position:'relative', top:'5px'}}>
                        <FlatButton label="Cancel" onClick={this.props.onCancelMessageSelected}/>
                        <FlatButton label="Send Message" onClick={this.onSendMessageSelected} primary={true} />
                    </div>
                </Paper>
            </div>
        );
    }

    renderSubjectType() {
        switch(this.state.subjectType) {
            case Subjects.Type.SUBJECT_TYPE_DISCUSSION:
                return <IconButton><DiscussionIcon/></IconButton>;
            break;
            case Subjects.Type.SUBJECT_TYPE_TASK:
            return <IconButton><TaskIcon/></IconButton>;
            break;
            }
    }

    handleSubjectSelected(subject) {
        this.setState({subjectTitle: subject.title, subjectSeq:subject.seq, subjectId: subject._id, subjectType: subject.type});
    }

    onSendMessageSelected() {
        this.setState({content: '', subjectTitle:''});
        this.props.onSendMessageSelected(this.state.content, this.state.subjectId, this.state.subjectTitle);
    }

    handleClearSubject() {
        this.setState({popOverOpen:false, subjectTitle: '', subjectSeq: null, subjectId:null, subjectType: Subjects.Type.SUBJECT_TYPE_DISCUSSION});
    }
}
