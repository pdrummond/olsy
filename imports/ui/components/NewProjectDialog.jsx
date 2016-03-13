import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import { _ } from 'meteor/underscore';
import BaseDialog from './BaseDialog';
import {isEmpty, notEmpty} from '../helpers/string-helpers.js';

export default class NewProjectDialog extends BaseDialog {
    constructor(props) {
        super(props, {okLabel: "Create Project"});
        this.onProjectNameChanged = this.onProjectNameChanged.bind(this);
        this.onProjectKeyChanged = this.onProjectKeyChanged.bind(this);
        this.onOkSelected = this.onOkSelected.bind(this);
    }

    render() {
        return (
            <Dialog
                title="New Project"
                actions={this.actions}
                modal={true}
                open={this.state.open}
                >
                <TextField
                    ref="projectName"
                    autoFocus={true}
                    fullWidth={true}
                    hintText="Give your new project a name"
                    floatingLabelText="Project Name"
                    errorText={this.state.nameErrorText}
                    onChange={_.debounce(this.onProjectNameChanged, 100)}
                    />
                <br/>
                <TextField
                    ref="projectKey"
                    fullWidth={true}
                    hintText="Specify a unique key for your project"
                    errorText={this.state.keyErrorText}
                    value={this.state.keyValue}
                    floatingLabelText="Project Key"
                    onChange={this.onProjectKeyChanged}
                    />
            </Dialog>
        );
    }

    componentWillReceiveProps(nextProps) {
        BaseDialog.prototype.componentWillReceiveProps.call(this, nextProps);
        this.setState({keyValue: ""});
    }

    onProjectNameChanged() {
        var projectName = this.refs.projectName.getValue();

        if(notEmpty(projectName)) {
            this.setState({nameErrorText: '', keyErrorText: '', keyValue: projectName.substr(0, 3).toUpperCase()});
        } else {
            this.setState({keyValue: ''});
        }
        if(projectName.length > 80) {
            this.setState({nameErrorText: 'Project name is too long'});
        }
    }

    onProjectKeyChanged() {
        var projectKey = this.refs.projectKey.getValue();

        if(notEmpty(projectKey)) {
            this.setState({keyErrorText: '', keyValue: projectKey.toUpperCase()});
        } else {
            this.setState({keyValue: ''});
        }
        if(projectKey.length > 15) {
            this.setState({keyErrorText: 'Project key is too long'});
        }
    }

    onOkSelected() {
        var projectName = this.refs.projectName.getValue();
        var projectKey = this.refs.projectKey.getValue();
        var ok = true;
        if(isEmpty(projectName)) {
            this.setState({nameErrorText: "Project name field is required"});
            ok = false;
        }
        if(isEmpty(projectKey)) {
            this.setState({keyErrorText: "Project key is required"});
            ok = false;
        }
        if(ok) {
            this.setState({open: false});
            if(this.props.hasOwnProperty('onOkSelected')) {
                this.props.onOkSelected(this.refs.projectName.getValue(), this.refs.projectKey.getValue());
            }
        }
    }
}
