import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects.js';
import { createContainer } from '../helpers/create-container.jsx';
import ProjectPage from '../pages/ProjectPage.jsx';

export default createContainer((props) => {
    const publicHandle = Meteor.subscribe('projects.public');
    const currentHandle = Meteor.subscribe('projects.current', props.params.projectId);
    const usersHandle = Meteor.subscribe('users.all');

    return {
        user: Meteor.user(),
        loading: !(publicHandle.ready() && currentHandle.ready() && usersHandle.ready()),
        projects: Projects.find({
            $or: [
                { userId: { $exists: false } },
                { userId: Meteor.userId() }
            ]
        }, {sort: {updatedAt: -1, title: 1}}).fetch(),
        currentProject: Projects.findOne(props.params.projectId)
    };
}, ProjectPage);
