import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects.js';
import { Subjects } from '../../api/subjects/subjects.js';
import { createContainer } from '../helpers/create-container.jsx';
import ProjectPage from '../pages/ProjectPage.jsx';
import {ClientMessages} from '../../api/client-messages/client-messages.js';

export default createContainer((props) => {
    const publicProjectsHandle = Meteor.subscribe('projects.public');
    const currentProjectHandle = Meteor.subscribe('projects.current', props.params.projectId);
    const subjectsHandle = Meteor.subscribe('subjects.project', props.params.projectId);

    var currentSubjectHandleReady = false;
    if(props.params.subjectId) {
        currentSubjectHandleReady = Meteor.subscribe('subjects.current', props.params.subjectId).ready();
    } else {
        currentSubjectHandleReady = true;
    }


    var data =  {
        user: Meteor.user(),
        loading: !(publicProjectsHandle.ready() && currentProjectHandle.ready() && subjectsHandle.ready() && currentSubjectHandleReady),
        projects: Projects.find({
            $or: [
                { userId: { $exists: false } },
                { userId: Meteor.userId() }
            ]
        }, {sort: {updatedAt: -1, title: 1}}).fetch(),
        currentProject: Projects.findOne(props.params.projectId),
        subjects: Subjects.find({projectId: props.params.projectId}, {sort: {updatedAt: -1, title: 1}}).fetch(),
        currentSubject: Subjects.findOne(props.params.subjectId),
        subjectMessages: ClientMessages.find({projectId: props.params.projectId, subjectId: props.params.subjectId}, {sort: {createdAt: 1}}).fetch()
    };
    console.log("loading: " + data.loading);
    console.log("USER: " + JSON.stringify(Meteor.user()));
    return data;

}, ProjectPage);
