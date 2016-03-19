import React from 'react';
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
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

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
            <List>
                {this.renderSubjectItems()}
            </List>
        );
    }

    renderSubjectItems() {
        return this.props.subjects.map(function(subject) {
            return <ListItem
                key={subject._id}
                primaryText={subject.title}
                leftAvatar={<Avatar icon={<DiscussionIcon />} backgroundColor={Colors.cyan900} />}
                rightIconButton={rightIconMenu}
                secondaryText={
                    <div>
                        <span className="key">OLS-6: Created by pdrummond 2 minutes ago</span> <span className="label">open</span>
                    </div>
                }
                />
        }.bind(this));
    }
}
