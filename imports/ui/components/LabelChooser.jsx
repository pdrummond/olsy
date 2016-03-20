import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';
import Toggle from 'material-ui/lib/toggle';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';

export default class LabelChooser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div style={{padding:'10px', marginBottom:'20px'}}>
                <Paper style={{padding:'10px'}}>
                    <List subheader="Labels">
                        <TextField
                            fullWidth={true}
                            style={{marginLeft:'5px'}}
                            hintText="Type here to search for a specific label"
                            floatingLabelText="Search"
                            />
                        <ListItem
                            leftCheckbox={<Checkbox />}
                            primaryText="Release 1"
                            secondaryText="Release 1 is focused on core features only"
                            />
                        <ListItem
                            leftCheckbox={<Checkbox />}
                            primaryText="In Progress"
                            />
                        <ListItem
                            leftCheckbox={<Checkbox />}
                            primaryText="Need more info"
                            />
                    </List>
                </Paper>
            </div>
        );
    }
}
