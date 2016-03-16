import React from 'react';
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
    }

    render() {
        return (
            <div className="message-box" style={{width:this.props.fullWidth?'100%':'calc(100% - 600px)'}}>
                <Paper zDepth={1} style={{padding:'20px', backgroundColor:'whitesmoke'}}>
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
                    <TextField
                        fullWidth={true}
                        hintText="Enter your message here"
                        floatingLabelText="Message Body"
                        multiLine={true}
                        rows={1}
                        rowsMax={20}
                        />
                    <br/>
                    <div style={{textAlign:'right', position:'relative', top:'5px'}}>
                        <FlatButton label="Cancel" />
                        <FlatButton label="Send Message" primary={true} />
                    </div>
                </Paper>
            </div>
        );
    }
}
