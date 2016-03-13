import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
Meteor.startup(function() {
    injectTapEventPlugin();
});

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import ProjectContainer from '../../ui/containers/ProjectContainer.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
        <Route path="/project" component={ProjectContainer}/>
    </Route>
  </Router>
);
