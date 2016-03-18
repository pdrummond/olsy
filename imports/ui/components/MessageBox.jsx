import React from 'react';
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

export default class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
        }
        this.onContentChange = this.onContentChange.bind(this);
        this.onSendMessageSelected = this.onSendMessageSelected.bind(this);
    }

    onContentChange(content) {
        this.setState({content})
    }

    render() {
        return (
            <div className="message-box" style={{width:this.props.fullWidth?'100%':'calc(100% - 600px)'}}>
                <Paper zDepth={1} style={{padding:'0px 20px 10px 20px', backgroundColor:'whitesmoke'}}>
                    <span style={{display:'flex', alignItems: 'flex-end'}}>
                        <IconMenu
                            iconButtonElement={<IconButton><DiscussionIcon/></IconButton>} >
                            <MenuItem primaryText="Discussion" leftIcon={<DiscussionIcon/>}/>
                            <MenuItem primaryText="Task" leftIcon={<TaskIcon />}/>
                            <MenuItem primaryText="Bug"  leftIcon={<BugIcon />}/>
                        </IconMenu>
                        <TextField fullWidth={true} hintText="Optionally enter a subject here" floatingLabelText="Subject" style={{marginRight:'10px'}}/>
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

    onSendMessageSelected() {
        this.setState({content: ''});
        this.props.onSendMessageSelected(this.state.content);
    }
}
