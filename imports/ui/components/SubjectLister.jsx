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
import LinearProgress from 'material-ui/lib/linear-progress';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import ContentFilter from 'material-ui/lib/svg-icons/content/filter-list';

import { Subjects } from '../../api/subjects/subjects.js';



const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left">
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);

const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>New</MenuItem>
        <MenuItem>In Progress</MenuItem>
        <MenuItem>Done</MenuItem>
    </IconMenu>
);

export default class SubjectLister extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <div style={{display:'flex', padding:'0px 10px'}}>
                    <SelectField value={'all'}  floatingLabelText="Type">
                        <MenuItem value={'all'} primaryText="All"/>
                        <MenuItem value={'discussion'} primaryText="Discussion"/>
                        <MenuItem value={'task'} primaryText="Task"/>
                    </SelectField>
                    <SelectField value={'all'} style={{marginLeft:'5px'}} floatingLabelText="Status">
                        <MenuItem value={'all'} primaryText="All"/>
                        <MenuItem value={'open'} primaryText="Open"/>
                        <MenuItem value={'in-progress'} primaryText="In Progress"/>
                        <MenuItem value={'done'} primaryText="Done"/>
                    </SelectField>
                    <AutoComplete
                        searchText='All'
                        style={{marginLeft:'5px'}}
                        floatingLabelText="Assignee"
                        filter={AutoComplete.fuzzyFilter}
                        triggerUpdateOnFocus={true}
                        dataSource={['pdrummond', 'harold', 'fred']}
                        />
                    <IconMenu
                        iconButtonElement={<IconButton><ContentFilter /></IconButton>}
                        value={1}>
                        <MenuItem value="1" primaryText="Newest First" />
                        <MenuItem value="2" primaryText="Oldest First" />
                        <MenuItem value="3" primaryText="Most Messages" />
                        <MenuItem value="4" primaryText="Most Activity" />
                    </IconMenu>
                </div>
                <List>
                    {this.renderSubjectItems()}
                </List>
            </div>
        );
    }

    renderSubjectItems() {
        return this.props.subjects.map(function(subject) {
            return <ListItem
                key={subject._id}
                primaryText={subject.title}
                leftAvatar={this.renderAvatar(subject)}
                rightIconButton={rightIconMenu}
                onTouchTap={() => { browserHistory.push(`/project/${subject.projectId}/subject/${subject._id}`); }}
                secondaryText={
                    <div>
                        <span className="key">{this.props.projectKey}-{subject.seq}: Created by pdrummond 2 minutes ago</span> <span className="label">open</span>
                    </div>
                }
                />
        }.bind(this));
    }

    renderAvatar(subject) {
        switch(subject.type) {
            case Subjects.Type.SUBJECT_TYPE_DISCUSSION: return <Avatar icon={<DiscussionIcon />} backgroundColor={Colors.cyan900} />;
            case Subjects.Type.SUBJECT_TYPE_TASK: return <Avatar icon={<TaskIcon />} backgroundColor={Colors.green700} />;
        }
    }
}
