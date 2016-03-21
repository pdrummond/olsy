import React from 'react';
import { browserHistory } from 'react-router';
import Colors from 'material-ui/lib/styles/colors';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import BugIcon from 'material-ui/lib/svg-icons/action/bug-report';
import TaskIcon from 'material-ui/lib/svg-icons/alert/error';
import DiscussionIcon from 'material-ui/lib/svg-icons/communication/chat';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import LinearProgress from 'material-ui/lib/linear-progress';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import ContentFilter from 'material-ui/lib/svg-icons/content/filter-list';
import Paper from 'material-ui/lib/paper';
import FloatingActionButton from 'material-ui/lib/floating-action-button';


import { Subjects } from '../../api/subjects/subjects.js';


const styles = {
    filterComponent: {
        marginLeft:'5px'
    }
};

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left">
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);


export default class SubjectLister extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openFilterBox: false,
            typeFilter: 'all',
            statusFilter: 'open'
        }
        this.handleTypeFilterChange = this.handleTypeFilterChange.bind(this);
        this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    }

    render() {

        return (
            <div>
                {this.renderFilterBox()}
                <List>
                    {this.renderSubjectItems()}
                </List>
            </div>
        );
    }

    handleTypeFilterChange(e, idx, value) {
        this.setState({typeFilter: value});
    }

    handleStatusFilterChange(e, idx, value) {
        this.setState({statusFilter: value});
    }

    renderFilterBox() {
        if(this.state.openFilterBox) {
            return (
                <div style={{position:'fixed', bottom:'0px', left:'0px', padding:'10px'}}>
                    <Paper>
                        <div style={{display:'flex', flexWrap: 'wrap', padding:'0px 10px', backgroundColor:'whitesmoke'}}>

                            <SelectField onChange={this.handleTypeFilterChange} value={this.state.typeFilter}  style={styles.filterComponent} floatingLabelText="Type">
                                <MenuItem value={'all'} primaryText="All"/>
                                <MenuItem value={'discussion'} primaryText="Discussions"/>
                                <MenuItem value={'task'} primaryText="Tasks"/>
                            </SelectField>
                            <SelectField onChange={this.handleStatusFilterChange} value={this.state.statusFilter}  style={styles.filterComponent} floatingLabelText="Status">
                                <MenuItem value={'all'} primaryText="All"/>
                                <MenuItem value={'open'} primaryText="Open"/>
                                <MenuItem value={'closed'} primaryText="Closed"/>
                            </SelectField>
                            {/*<AutoComplete
                                searchText='All'
                                style={styles.filterComponent}
                                floatingLabelText="Assignee"
                                filter={AutoComplete.fuzzyFilter}
                                triggerUpdateOnFocus={true}
                                dataSource={['pdrummond', 'harold', 'fred']}
                                />*/}
                            <SelectField value={'all'}  floatingLabelText="Label" style={styles.filterComponent}>
                                <MenuItem value={'all'} primaryText="All"/>
                                <MenuItem value={'in-progress'} primaryText="In Progress"/>
                                <MenuItem value={'important'} primaryText="Important"/>
                                <MenuItem value={'on-hold'} primaryText="On Hold"/>
                                <MenuItem value={'in-test'} primaryText="In Test"/>
                                <MenuItem value={'release-1'} primaryText="Release 1"/>
                                <MenuItem value={'release-2'} primaryText="Relese 2"/>
                                <MenuItem value={'sprint-1'} primaryText="Sprint 1"/>
                            </SelectField>
                            <SelectField value={1}  floatingLabelText="Order by" style={styles.filterComponent}>
                                <MenuItem value={1} primaryText="Newest First" />
                                <MenuItem value={2} primaryText="Oldest First" />
                                <MenuItem value={3} primaryText="Most Messages" />
                                <MenuItem value={4} primaryText="Most Activity" />
                            </SelectField>
                        </div>
                    </Paper>
                </div>
            );
        } else {
            return (
                <FloatingActionButton onTouchTap={() => {this.setState({openFilterBox: true})}} secondary={true} mini={true} style={{position:'fixed', bottom:'20px', right:'20px'}}>
                    <ContentFilter />
                </FloatingActionButton>
            );
        }
    }

    renderSubjectItems() {
        var self = this;
        var filteredSubjects = this.props.subjects;
        filteredSubjects = this.props.subjects.filter(function(subject) {
            var allowed = true;
            if(this.state.typeFilter != 'all') {
                allowed = subject.type == this.state.typeFilter;
            }
            if(this.state.statusFilter != 'all') {
                if(subject.status == null) {
                    subject.status = 'open';
                }
                allowed = subject.status == this.state.statusFilter;
            }
            return allowed;
        }.bind(this));

        return filteredSubjects.map(function(subject) {
            return <ListItem
                key={subject._id}
                primaryText={subject.title?<span>{this.props.projectKey}-{subject.seq}: {subject.title}</span> : ''}
                leftAvatar={this.renderAvatar(subject)}
                rightIconButton={
                        <IconMenu iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={() => { self.props.onSubjectToggleStatusSelected(subject)}}>{subject.status == 'open'?"Close":"Open"}</MenuItem>
                            <Divider/>
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Delete</MenuItem>
                        </IconMenu>
                }
                onTouchTap={() => { browserHistory.push(`/project/${subject.projectId}/subject/${subject._id}`); }}
                secondaryText={
                    <div>
                        {this.renderClosedLabel(subject)}
                        <span className="label">Release One</span> <span className="label">In Progress</span>
                    </div>
                }
                />
        }.bind(this));
    }

    renderClosedLabel(subject) {
        if(subject.status == 'closed') {
            return <span className="label status-label closed">CLOSED</span>;
        }
    }

    renderAvatar(subject) {
        switch(subject.type) {
            case Subjects.Type.SUBJECT_TYPE_DISCUSSION: return <Avatar icon={<DiscussionIcon />} backgroundColor={Colors.cyan900} />;
            case Subjects.Type.SUBJECT_TYPE_TASK: return <Avatar icon={<TaskIcon />} backgroundColor={Colors.green700} />;
        }
    }
}
