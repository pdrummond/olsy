import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppContainer from '../../ui/containers/AppContainer.jsx';
import ProjectContainer from '../../ui/containers/ProjectContainer.jsx';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';
import WelcomeContainer from '../../ui/containers/WelcomeContainer.jsx';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
Meteor.startup(function() {
    injectTapEventPlugin();
});

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
        <Route path="/welcome" component={WelcomeContainer}/>
        <Route path="/project/:projectId" component={ProjectContainer}/>
        <Route path="/project/:projectId/subject/:subjectId" component={ProjectContainer}/>
        <Route path="/project/:projectId/subject/:subjectId/details" component={ProjectContainer}/>
        <Route path="signin" component={AuthPageSignIn}/>
        <Route path="join" component={AuthPageJoin}/>
        <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);
