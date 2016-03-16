import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

import BaseDialog from './BaseDialog';

export default class ConfirmProjectDeleteDialog extends BaseDialog {
    constructor(props) {
        super(props, {okLabel: "Delete"});
    }

    render() {
        return (
            <Dialog
                title="Delete Project"
                actions={this.actions}
                modal={true}
                open={this.state.open}>
                This action cannot be undone. Are you sure you want to delete this project and all its history and items?
            </Dialog>
        );
    }
}
