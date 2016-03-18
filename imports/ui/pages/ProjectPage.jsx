import React from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';
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
import Divider from 'material-ui/lib/divider';
import Paper from 'material-ui/lib/paper';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';

import { Projects } from '../../api/projects/projects.js';
import ProjectLister from '../components/ProjectLister';
import ProjectPlanner from '../components/ProjectPlanner';
import NewProjectDialog from '../components/NewProjectDialog';
import ConfirmProjectDeleteDialog from '../components/ConfirmProjectDeleteDialog';
import MessageHistory from '../components/MessageHistory';
import MessageBox from '../components/MessageBox';
import { displayError } from '../helpers/errors.js';

import {
    insertProject,
    removeProject,
    updateIsFavourite,
    updateProjectOrder
} from '../../api/projects/methods.js';

import {
    insertMessage
} from '../../api/server-messages/methods.js';

const AUTO_DOCK_WIDTH = 1200;

export default class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProject: {
                name: ''
            },
            openMessageBox: false,
            openLeftSidebar: false,
            dockLeftSidebar: true,
            openRightSidebar: false,
            dockRightSidebar: true,
            openNewProjectDialog: false,
            openConfirmProjectDeleteDialog: false
        };
        this.handleProjectSelected = this.handleProjectSelected.bind(this);
        this.handleToggleLeftSidebar = this.handleToggleLeftSidebar.bind(this);
        this.handleToggleRightSidebar = this.handleToggleRightSidebar.bind(this);
        this.handleFavouriteSelected = this.handleFavouriteSelected.bind(this);
        this.onNewProjectSelected = this.onNewProjectSelected.bind(this);
        this.insertProject = this.insertProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.handleSendMessageSelected = this.handleSendMessageSelected.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps: " + JSON.stringify(nextProps.currentProject));
        if(this.props.currentProject == null || this.props.currentProject._id !== nextProps.currentProject._id) {
            console.log("project has changed");
            this.setState({currentProject: nextProps.currentProject});
        }
    }

    handleToggleLeftSidebar() {
        this.setState({openLeftSidebar: !this.state.openLeftSidebar});
    }

    handleToggleRightSidebar() {
        this.setState({openRightSidebar: !this.state.openRightSidebar});
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
                    onOkSelected={this.deleteProject}/>
                <LeftNav className="left-nav"
                    width={400}
                    docked={false}
                    open={this.state.openLeftSidebar}
                    onRequestChange={open => this.setState({openLeftSidebar:open})}>
                    <AppBar
                        title="Projects"
                        iconElementRight={<FlatButton onTouchTap={this.onNewProjectSelected} label="New Project" primary={true} />}
                        style={{backgroundColor: Colors.red700}}
                        onLeftIconButtonTouchTap={this.handleToggleLeftSidebar}/>
                    <ProjectLister
                        projects={this.props.projects}
                        onProjectSelected={this.handleProjectSelected}
                        onRemoveFavouriteSelected={this.handleFavouriteSelected}
                        onToggleFavouriteSelected={this.onToggleFavouriteSelected}
                        onRemoveProjectSelected={this.onRemoveProjectSelected}
                        onUpdateFavouritesOrder={this.onUpdateFavouritesOrder}
                        />
                </LeftNav>
                <LeftNav className="right-nav"
                    openRight={true}
                    width={600}
                    docked={this.state.windowWidth < AUTO_DOCK_WIDTH ? false : this.state.dockRightSidebar}
                    open={this.state.openRightSidebar}
                    onRequestChange={open => this.setState({openRightSidebar:open})}>
                    <AppBar
                        title="Project Planner"
                        iconElementRight={<FlatButton label="Create" primary={true} />}
                        style={{backgroundColor: Colors.red700}}
                        onLeftIconButtonTouchTap={this.handleToggleRightSidebar} />
                    <ProjectPlanner/>
                </LeftNav>
                <AppBar
                    title={this.state.currentProject.name}
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
                            <MenuItem primaryText="Toggle Right View" index={1} onTouchTap={this.handleToggleRightSidebar}/>
                            <Divider/>
                            <MenuItem primaryText="Help" index={2} />
                            <MenuItem primaryText="Sign out" index={3} onTouchTap={() => { Meteor.logout(); }}/>
                        </IconMenu>
                    }
                    />
                <div className="app-container" style={{width:this.state.windowWidth >= AUTO_DOCK_WIDTH && this.state.openRightSidebar?'calc(100% - 600px)':'100%'}}>
                    {this.renderSignInBanner()}
                    <MessageHistory currentProject={this.state.currentProject} style={{height:(this.state.openMessageBox?'calc(100% - 340px)':'calc(100% - 65px)') }}/>
                    {this.renderMessageBox()}
                </div>
            </div>
        );
    }

    renderMessageBox() {
        if(this.props.user) {
            if(this.state.openMessageBox) {
                return (
                    <MessageBox onCancelMessageSelected={() => {this.setState({openMessageBox: false})}}
                        onSendMessageSelected={this.handleSendMessageSelected}
                        fullWidth={this.state.windowWidth < AUTO_DOCK_WIDTH || !this.state.openRightSidebar}/>
                );
            } else {
                return (
                    <FloatingActionButton style={{position:'fixed', bottom:'30px', right:this.state.windowWidth < AUTO_DOCK_WIDTH || !this.state.openRightSidebar?'30px':'630px'}} onTouchTap={ () => { this.setState({openMessageBox: true})} }>
                        <ContentAdd />
                    </FloatingActionButton>
                )
            }
        }
    }

    renderSignInBanner() {
        if(!this.props.user) {
            return (
                <Paper style={{backgroundColor: 'whitesmoke', padding:'20px'}}>
                    Want to contribute to this project?
                    <RaisedButton href="/join" linkButton={true} label="Sign-up for free" primary={true} style={{marginLeft:'5px', marginRight:'5px'}}/>
                    or <a href="/tour">Learn more about OpenLoops</a>
                </Paper>
            );
        }
    }

    handleProjectSelected(project) {
        this.setState({currentProject: project, openLeftSidebar:false});
        browserHistory.push(`/project/${project._id}`);
    }

    handleSendMessageSelected(content) {
        console.log("sending message boom: " + this.state.currentProject._id);
        insertMessage.call({
            content: content,
            username: 'pdrummond', //TODO
            projectId: this.state.currentProject._id
        }, displayError);
    }

    onToggleFavouriteSelected(project) {
        updateIsFavourite.call({
            projectId: project._id,
            isFavourite: !project.isFavourite
        }, displayError);
    }

    handleFavouriteSelected(project) {
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
        this.setState({windowWidth:width});
    }
}

ProjectPage.propTypes = {
    children: React.PropTypes.element // matched child route component
};

ProjectPage.contextTypes = {
    router: React.PropTypes.object
};
