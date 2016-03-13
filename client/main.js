import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import { renderRoutes } from '../imports/startup/client/routes.jsx';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});
