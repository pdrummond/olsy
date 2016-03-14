import React from 'react';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';

export default class MessageBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="message-box">
                <Paper zDepth={1} style={{padding:'20px', backgroundColor:'whitesmoke'}}>
                    <div style={{display:'flex'}}>
                        <TextField fullWidth={true} hintText="Optionally enter a subject here" floatingLabelText="Subject" style={{marginRight:'10px'}}/>
                        <TextField fullWidth={true} hintText="A list of members this message is aimed at" floatingLabelText="To"/>
                    </div>
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
