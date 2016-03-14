import React from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
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
import ProjectLister from '../components/ProjectLister';
import ProjectPlanner from '../components/ProjectPlanner';
import NewProjectDialog from '../components/NewProjectDialog';
import ConfirmProjectDeleteDialog from '../components/ConfirmProjectDeleteDialog';
import MessageHistory from '../components/MessageHistory'
import { displayError } from '../helpers/errors.js';

import {
    insertProject,
    removeProject,
    updateIsFavourite,
    updateProjectOrder
} from '../../api/projects/methods.js';

const AUTO_DOCK_WIDTH = 1200;

export default class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openLeftSidebar: false,
            openRightSidebar: true,
            openNewProjectDialog: false,
            openConfirmProjectDeleteDialog: false
        };
        this.handleToggleLeftSidebar = this.handleToggleLeftSidebar.bind(this);
        this.onRemoveProjectSelected = this.onRemoveProjectSelected.bind(this);
        this.onNewProjectSelected = this.onNewProjectSelected.bind(this);
        this.insertProject = this.insertProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    handleToggleLeftSidebar() {
        this.setState({openLeftSidebar: !this.state.openLeftSidebar});
    }

    render() {
        return (
            <div className="project-page">
                <NewProjectDialog
                    open={this.state.openNewProjectDialog}
                    onCancelSelected={() => { this.setState({openNewProjectDialog: false})}}
                    onOkSelected={this.insertProject}/>
                <ConfirmProjectDeleteDialog
                    open={this.state.openConfirmProjectDeleteDialog}
                    onCancelSelected={() => { this.setState({openConfirmProjectDeleteDialog: false})}}
                    onDeleteSelected={this.deleteProject}/>
                <LeftNav className="left-nav"
                    width={400}
                    docked={false}
                    open={this.state.openLeftSidebar}
                    onRequestChange={open => this.setState({openLeftSidebar:open})}>
                    <AppBar
                        title="OLS: OpenLoops"
                        iconElementRight={<FlatButton onTouchTap={this.onNewProjectSelected} label="New Project" primary={true} />}
                        style={{backgroundColor: Colors.red700}}
                        onLeftIconButtonTouchTap={this.handleToggleLeftSidebar}/>
                    <ProjectLister
                        projects={this.props.projects}
                        onRemoveFavouriteSelected={this.onRemoveFavouriteSelected}
                        onToggleFavouriteSelected={this.onToggleFavouriteSelected}
                        onRemoveProjectSelected={this.onRemoveProjectSelected}
                        onUpdateFavouritesOrder={this.onUpdateFavouritesOrder}
                        />
                </LeftNav>
                <LeftNav className="right-nav"
                    openRight={true}
                    width={600}
                    docked={true}
                    open={this.state.openRightSidebar}
                    onRequestChange={open => this.setState({openLeftSidebar:open})}>
                    <AppBar
                        title="Project Planner"
                        showMenuIconButton={false}
                        iconElementRight={<FlatButton label="Create" primary={true} />}
                        style={{backgroundColor: Colors.red700}} />
                    <ProjectPlanner/>
                </LeftNav>
                <AppBar
                    title="OLS: OpenLoops"
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
                <div className="app-container">
                    <MessageHistory/>
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

    onNewProjectSelected() {
        this.setState({openNewProjectDialog: true});
    }

    insertProject(name, key) {
        this.setState({openNewProjectDialog: false});
        insertProject.call({name,key}, displayError);
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
