import { Meteor } from 'meteor/meteor';
import { createContainer } from '../helpers/create-container.jsx';
import WelcomePage from '../pages/WelcomePage.jsx';

export default createContainer(() => {
    const usersHandle = Meteor.subscribe('users.data');

    var data = {
        loading: !(usersHandle.ready()),
        user: Meteor.user()
    };
    console.log("WelcomeContainer loading: " + data.loading);
    return data;
}, WelcomePage);
