import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects.js';
import { createContainer } from '../helpers/create-container.jsx';
import App from '../layouts/App.jsx';

export default createContainer(() => {  
  return {
    user: Meteor.user()
  };
}, App);
