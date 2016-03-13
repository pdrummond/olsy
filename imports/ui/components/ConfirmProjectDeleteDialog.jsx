import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

export default class ConfirmProjectDeleteDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.onCancelSelected = this.onCancelSelected.bind(this);
        this.onDeleteSelected = this.onDeleteSelected.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.open) {
            this.setState({open: nextProps.open});
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.onCancelSelected}
                />,
            <FlatButton
                label="Delete"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.onDeleteSelected}
                />
        ];
        return (
            <Dialog
                title="Delete Project"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.close}
                >
                This action cannot be undone. Are you sure you want to delete this project and all its history and items?
            </Dialog>
        );
    }

    onDeleteSelected() {
        this.close();
        this.props.onDeleteSelected();
    }

    onCancelSelected() {
        this.close();
        this.props.onCancelSelected();
    }

    open() {
        this.setState({open:true});
    }

    close() {
        this.setState({open:false});
    }


}
