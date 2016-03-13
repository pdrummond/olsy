import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';


export default class BaseDialog extends React.Component {
    constructor(props, opts) {
        super(props, opts);
        opts.okLabel = opts.okLabel || "Ok";
        opts.cancelLabel = opts.cancelLabel || "Cancel";
        this.state = {
            open: false,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.onOkSelected = this.onOkSelected.bind(this);
        this.onCancelSelected = this.onCancelSelected.bind(this);
        this.actions = [
            <FlatButton
                label={opts.cancelLabel}
                secondary={true}
                onTouchTap={this.onCancelSelected}
                />,
            <FlatButton
                label={opts.okLabel}
                primary={true}                
                onTouchTap={this.onOkSelected}
                />,
        ];
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.open) {
            this.setState({open: nextProps.open});
        }
    }

    handleOpen() {
        this.setState({open: true});
    }

    onCancelSelected() {
        this.setState({open: false});
        if(this.props.hasOwnProperty('onCancelSelected')) {
            this.props.onCancelSelected();
        }
    }

    onOkSelected() {
        this.setState({open: false});
        if(this.props.hasOwnProperty('onOkSelected')) {
            this.props.onOkSelected();
        }
    }
}
