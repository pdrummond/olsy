import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects.js';
import { createContainer } from '../helpers/create-container.jsx';
import ProjectPage from '../pages/ProjectPage.jsx';

export default createContainer(() => {
    const publicHandle = Meteor.subscribe('projects.public');

    return {
        user: Meteor.user(),
        loading: !(publicHandle.ready()),
        projects: Projects.find({
            $or: [
                { userId: { $exists: false } },
                { userId: Meteor.userId() }
            ]
        }, {sort: {updatedAt: -1, title: 1}}).fetch()
    };
}, ProjectPage);
