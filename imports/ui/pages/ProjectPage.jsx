import React from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import SvgIcon from 'material-ui/lib/svg-icon';
import Colors from 'material-ui/lib/styles/colors';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/lib/avatar';

import { Projects } from '../../api/projects/projects.js';
import ProjectLister from '../components/ProjectLister.jsx';
import { displayError } from '../helpers/errors.js';
import ConfirmProjectDeleteDialog from '../components/ConfirmProjectDeleteDialog';


import {
    updateIsFavourite,
    updateProjectOrder,
    removeProject
} from '../../api/projects/methods.js';

const AUTO_DOCK_WIDTH = 1200;

export default class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openLeftSidebar: false,
            openConfirmProjectDeleteDialog: false
        };
        this.handleToggleLeftSidebar = this.handleToggleLeftSidebar.bind(this);
        this.onRemoveProjectSelected = this.onRemoveProjectSelected.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    handleToggleLeftSidebar() {
        this.setState({openLeftSidebar: !this.state.openLeftSidebar});
    }

    render() {
        return (
            <div className="project-page">
                <ConfirmProjectDeleteDialog
                    open={this.state.openConfirmProjectDeleteDialog}
                    onCancelSelected={() => { this.setState({openConfirmProjectDeleteDialog: false})}}
                    onDeleteSelected={this.deleteProject}/>
                <LeftNav className="left-nav"
                    width={400}
                    docked={this.state.width > AUTO_DOCK_WIDTH}
                    open={this.state.width > AUTO_DOCK_WIDTH ? true : this.state.openLeftSidebar}
                    onRequestChange={open => this.setState({openLeftSidebar:open})}>
                    <AppBar title="Home" style={{backgroundColor: Colors.red700}} onLeftIconButtonTouchTap={this.handleToggleLeftSidebar}/>
                    <ProjectLister
                        projects={this.props.projects}
                        onRemoveFavouriteSelected={this.onRemoveFavouriteSelected}
                        onToggleFavouriteSelected={this.onToggleFavouriteSelected}
                        onRemoveProjectSelected={this.onRemoveProjectSelected}
                        onUpdateFavouritesOrder={this.onUpdateFavouritesOrder}
                        />
                </LeftNav>
                <AppBar
                    title="Home"
                    onLeftIconButtonTouchTap={this.handleToggleLeftSidebar}
                    style={{backgroundColor: Colors.red700}}
                    iconElementRight={
                        <IconMenu
                            iconButtonElement={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            >
                            <MenuItem primaryText="Help" index={1} />
                            <MenuItem primaryText="Sign out" index={2} />
                        </IconMenu>
                    }
                    />
                <div className="app-container" style={{paddingLeft: this.state.width > AUTO_DOCK_WIDTH ? '400px' : '0px'}}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    onToggleFavouriteSelected(project) {
        updateIsFavourite.call({
            projectId: project._id,
            isFavourite: !project.isFavourite
        }, displayError);
    }

    onRemoveFavouriteSelected(project) {
        updateIsFavourite.call({
            projectId: project._id,
            isFavourite: false
        }, displayError);
    }

    onUpdateFavouritesOrder(projects) {
        updateProjectsOrder.call(projects);
    }

    onRemoveProjectSelected(project) {
        this.setState({openConfirmProjectDeleteDialog: true, selectedProject: project});
    }

    deleteProject() {
        this.setState({openConfirmProjectDeleteDialog: false, selectedProject: null});
        removeProject.call({
            projectId: this.state.selectedProject._id
        }, displayError);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        var w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
        this.setState({width:width});
    }
}

ProjectPage.propTypes = {
    children: React.PropTypes.element // matched child route component
};

ProjectPage.contextTypes = {
    router: React.PropTypes.object
};
