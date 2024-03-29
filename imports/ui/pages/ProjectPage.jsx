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
import TaskIcon from 'material-ui/lib/svg-icons/alert/error';
import DiscussionIcon from 'material-ui/lib/svg-icons/communication/chat';

import { Projects } from '../../api/projects/projects.js';
import { Subjects } from '../../api/subjects/subjects.js';

import ProjectLister from '../components/ProjectLister';
import SubjectLister from '../components/SubjectLister';
import SubjectDetailer from '../components/SubjectDetailer';
import NewProjectDialog from '../components/NewProjectDialog';
import ConfirmProjectDeleteDialog from '../components/ConfirmProjectDeleteDialog';
import MessageHistory from '../components/MessageHistory';
import MessageBox from '../components/MessageBox';
import { displayError } from '../helpers/errors.js';

const style = {
    subjectAvatar: {
        position: 'relative',
        top: '5px',
        marginRight: '10px'
    }
};

import {
    insertProject,
    removeProject,
    updateIsFavourite,
    updateProjectOrder
} from '../../api/projects/project-methods.js';

import {
    updateSubject,
    toggleSubjectStatus
} from '../../api/subjects/subject-methods.js';

import {
    insertMessage
} from '../../api/server-messages/server-message-methods.js';

const AUTO_DOCK_WIDTH = 1200;

export default class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProject: {
                name: ''
            },
            openMessageBox: true,
            openLeftSidebar: false,
            dockLeftSidebar: true,
            openRightSidebar: true,
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
        this.handleMessageSubjectSelected = this.handleMessageSubjectSelected.bind(this);
        this.renderMessageBox = this.renderMessageBox.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.currentProject == null || this.props.currentProject._id !== nextProps.currentProject._id) {
            this.setState({currentProject: nextProps.currentProject, selectedSubject: null});
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
                        style={{backgroundColor: Colors.cyan900}}
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
                <LeftNav
                    className="right-nav"
                    openRight={true}
                    width={600}
                    docked={this.state.windowWidth < AUTO_DOCK_WIDTH ? false : this.state.dockRightSidebar}
                    open={this.state.openRightSidebar}
                    onRequestChange={open => this.setState({openRightSidebar:open})}>
                    <AppBar
                        title={this.renderRightViewTitle()}
                        iconElementRight={<FlatButton label="Create" primary={true} />}
                        style={{backgroundColor: Colors.cyan900}}
                        onLeftIconButtonTouchTap={this.handleToggleRightSidebar} />
                    {this.renderRightView()}
                </LeftNav>
                <AppBar
                    title={<span style={{cursor:'pointer'}}>{this.state.currentProject.name}</span>}
                    onTitleTouchTap={() => { browserHistory.push('/project/' + this.state.currentProject._id)}}
                    onLeftIconButtonTouchTap={this.handleToggleLeftSidebar}
                    style={{backgroundColor: Colors.cyan900}}
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
                    {this.renderSubjectHeader()}
                    <MessageHistory
                        currentSubject={this.props.currentSubject}
                        onSubjectSelected={this.handleMessageSubjectSelected}
                        currentProject={this.state.currentProject}
                        style={{height:this.calculateMessageHistoryHeight()}}/>
                    {this.renderMessageBox()}
                </div>
            </div>
        );
    }

    calculateMessageHistoryHeight() {
        var height = 0;
        if(this.state.openMessageBox) {
            height += 285;
        }
        if(this.props.currentSubject) {
            height += 100;
        }
        return 'calc(100% - ' + height + 'px)';
    }

    renderMessageBox() {
        if(this.props.user) {
            return (
                <div>
                    <div style={{display:(this.state.openMessageBox?'block':'none')}}>
                        <MessageBox
                            projectKey={this.state.currentProject.key}
                            selectedSubject={this.state.selectedSubject?this.state.selectedSubject:this.props.currentSubject}
                            showSubjectUi={!this.props.currentSubject}
                            subjects={this.props.subjects}
                            onCancelMessageSelected={() => {this.setState({openMessageBox: false})}}
                            onSendMessageSelected={this.handleSendMessageSelected}
                            fullWidth={this.state.windowWidth < AUTO_DOCK_WIDTH || !this.state.openRightSidebar}/>
                    </div>
                    <div style={{display:(this.state.openMessageBox?'none':'block')}} >
                        <FloatingActionButton
                            style={{position:'fixed', bottom:'30px', right:this.state.windowWidth < AUTO_DOCK_WIDTH || !this.state.openRightSidebar?'30px':'630px'}} onTouchTap={ () => { this.setState({openMessageBox: true})} }>
                            <ContentAdd />
                        </FloatingActionButton>
                    </div>
                </div>
            );

        }
    }

    renderSubjectHeader() {
        if(this.props.currentSubject) {
            return (
                <div style={{padding:'15px 20px 10px 20px', background: 'whitesmoke', borderBottom: '1px solid lightgray'}}>
                    <div style={{color: '#ff5e0e', fontSize:'40px'}}>
                        {this.renderSubjectAvatar()}
                        <span style={{color:'gray'}}>{this.props.currentProject.key}-{this.props.currentSubject.seq}:</span> {this.props.currentSubject.title}
                    </div>
                    <div style={{fontSize: '18px', color: 'gray'}}>
                        <span style={{paddingLeft:'50px'}}>
                            {this.renderStatusLabel()}
                            pdrummond created this subject on March 21st, 2016 · 40 messages</span>
                    </div>
                </div>
            )
        }
    }

    renderStatusLabel() {
        var status = this.props.currentSubject.status || "open";
        return <span className={"label status-label subject-header-label " + status}>{status.toUpperCase()}</span> 
    }

    renderSubjectAvatar() {
        switch(this.props.currentSubject.type) {
            case Subjects.Type.SUBJECT_TYPE_DISCUSSION: return <Avatar style={style.subjectAvatar} icon={<DiscussionIcon />} backgroundColor={Colors.cyan900} />;
            case Subjects.Type.SUBJECT_TYPE_TASK: return <Avatar style={style.subjectAvatar} icon={<TaskIcon />} backgroundColor={Colors.green700} />;
        }

    }

    renderSignInBanner() {
        if(!this.props.user) {
            return (
                <Paper style={{backgroundColor: 'whitesmoke', padding:'20px'}}>
                    Want to contribute to this project?
                    <RaisedButton href="/join" linkButton={true} label="Sign-up for free" primary={true} style={{marginLeft:'5px', marginRight:'5px'}}/>
                    or <a href="/welcome">Learn more about OpenLoops</a>
                </Paper>
            );
        }
    }

    handleProjectSelected(project) {
        this.setState({currentProject: project, openLeftSidebar:false});
        browserHistory.push(`/project/${project._id}`);
    }

    handleSendMessageSelected(content, subjectId, subjectTitle, subjectType,) {
        var message = {
            content: content,
            subjectId: subjectId,
            subjectType: subjectType,
            subjectTitle: subjectTitle,
            username: this.props.user.username,
            projectId: this.state.currentProject._id
        };
        insertMessage.call(message, displayError);
    }

    handleMessageSubjectSelected(selectedSubject) {
        this.setState({openMessageBox:true, selectedSubject});
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

    renderRightViewTitle() {
        if(this.props.currentSubject) {
            return "OLS-666";
        } else {
            return "Subjects";
        }
    }

    renderRightView() {
        /*if(this.props.currentSubject) {
            return <SubjectDetailer
                projectKey={this.state.currentProject.key}
                subject={this.props.currentSubject}
                onSaveSelected={this.handleSubjectSaveSelected}/>;
        } else {*/
            return <SubjectLister
                onSubjectToggleStatusSelected={this.handleSubjectToggleStatusSelected}
                projectKey={this.state.currentProject.key}
                subjects={this.props.subjects}/>;
        //}
    }

    handleSubjectToggleStatusSelected(subject) {
        toggleSubjectStatus.call({subjectId: subject._id}, displayError);
    }

    handleSubjectSaveSelected(subject, type) {
        updateSubject.call({subjectId: subject._id, type}, displayError);
    }
}

ProjectPage.propTypes = {
    children: React.PropTypes.element // matched child route component
};

ProjectPage.contextTypes = {
    router: React.PropTypes.object
};
