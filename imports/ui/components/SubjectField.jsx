import React from 'react';
import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class SubjectField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }

    render() {
        return <AutoComplete ref="subject"
            onUpdateInput={(input) => {this.setState({value: input})}}
            searchText={this.state.value}
            fullWidth={true}
            hintText="Enter a subject here (optional)"
            floatingLabelText="Subject" style={{marginRight:'10px'}}
            filter={AutoComplete.fuzzyFilter}
            dataSource={this.generateSubjectDataSource()}
            />
    }

    generateSubjectDataSource() {
        var dataSource = this.props.subjects.map(function(subject) {
            return {
                text: subject.title,
                value: (
                    <MenuItem
                        primaryText={subject.title}
                        secondaryText="OLS-66"
                        onTouchTap={() => {
                            this.setState({value: subject.title});
                            this.props.onSubjectSelected(subject);
                        }}
                    />
                )
            }
        }.bind(this));
        return dataSource;
    }
}
