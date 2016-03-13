import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import CommunicationChatBubble from 'material-ui/lib/svg-icons/communication/chat-bubble';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import ActionAssignmentLate from 'material-ui/lib/svg-icons/action/assignment-late';
import Badge from 'material-ui/lib/badge';
import Colors from 'material-ui/lib/styles/colors';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import EmptyAlert from './EmptyAlert';

const iconButtonElement = (
    <IconButton touch={true}>
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);

export default class ProjectLister extends React.Component{

    constructor(props) {
        super(props);
        this.renderFavouritesList = this.renderFavouritesList.bind(this);
        this.renderFavouriteProjects = this.renderFavouriteProjects.bind(this);
        this.renderAllProjectsList = this.renderAllProjectsList.bind(this);
        this.renderAllProjects = this.renderAllProjects.bind(this);
        this.renderCommonMenuItems = this.renderCommonMenuItems.bind(this);
        this.onItemTouchTapped = this.onItemTouchTapped.bind(this);
        this.numFavouriteProjects = this.numFavouriteProjects.bind(this);
    }

    render() {
        if(this.props.projects.length == 0) {
            return <EmptyAlert msg='No Projects Found'/>
        } else {
            return (
                <div className="project-lister">
                    {this.renderFavouritesList()}
                    <Divider />
                    {this.renderAllProjectsList()}
                </div>
            );
        }
    }

    renderFavouritesList() {
        if(this.numFavouriteProjects() > 0 ) {
            return (
                <List ref="favouritesList" subheader="Favourite Projects">
                    {this.renderFavouriteProjects()}
                </List>
            )
        }
    }

    renderFavouriteProjects() {
        var self = this;
        return this.props.projects.map(function(project) {
            if(project.isFavourite) {
                return <ListItem
                    key={project._id}
                    className="favourite-item"
                    rightIconButton={
                        <IconMenu
                            iconButtonElement={iconButtonElement}
                            onItemTouchTap={this.onItemTouchTapped}>
                            <MenuItem ref="removeFavouriteMenuItem" value={project} > Remove star </MenuItem>
                            <Divider/>
                            {this.renderCommonMenuItems(project)}
                        </IconMenu>
                    }
                    primaryText={project.key + ": " + project.name}
                    leftIcon={<ActionGrade color={Colors.amber700}/>}
                    onTouchTap={this.handleToggle}
                    />
            }
        }.bind(this));
    }

    renderAllProjectsList() {
        if(this.props.projects.length > 0 ) {
            return (
                <List subheader='My Projects'>
                    {this.renderAllProjects()}
                </List>
            );
        }
    }

    renderAllProjects() {
        return this.props.projects.map(function(project) {
            return <ListItem
                key={project._id}
                primaryText={project.key + ": " + project.name}
                leftIcon={project.isFavourite ? <ActionGrade color={Colors.amber700}/> : <ActionAssignmentLate/>}
                rightIconButton={
                    <IconMenu iconButtonElement={iconButtonElement} onItemTouchTap={this.onItemTouchTapped}>
                        <MenuItem ref="toggleFavouriteMenuItem" value={project}>{project.isFavourite? "Remove star" : "Star this project"}</MenuItem>
                        <Divider/>
                        {this.renderCommonMenuItems(project)}
                    </IconMenu>
                }
                onTouchTap={this.handleToggle}
                />
        }.bind(this));
    }

    renderCommonMenuItems(project) {
        return (
            <MenuItem ref="removeProjectMenuItem" value={project}>Delete</MenuItem>
        );
    }

    onItemTouchTapped(event, item) {
        setTimeout(function() {
            switch(item.ref) {
                case 'toggleFavouriteMenuItem': this.props.onToggleFavouriteSelected(item.props.value); break;
                case 'removeFavouriteMenuItem': this.props.onRemoveFavouriteSelected(item.props.value); break;
                case 'removeProjectMenuItem': this.props.onRemoveProjectSelected(item.props.value); break;
            }
        }.bind(this), 200);
    }

    numFavouriteProjects() {
        return this.props.projects.filter(function(project) {
            return project.isFavourite;
        }).length;
    }
}
