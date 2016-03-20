import React from 'react';

export default class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
        this.renderLinks = this.renderLinks.bind(this);
    }

    render() {
        if(this.props.loading) {
            return (
                <p>Loading</p>
            );
        } else {
            return (
                <div className="page not-found">
                    <div className="content-scrollable">
                        <h1>Welcome to OpenLoops{this.props.user?", " + this.props.user.username: ""}</h1>
                        {this.renderLinks()}
                    </div>
                </div>
            );
        }
    }

    renderLinks() {
        if(this.props.user) {
            return (
                <ul>
                    <li>Click <a href={"/project/" + this.props.user.projectId}>here</a> to goto your projects</li>
                    <li>Click <a href="#" onClick={() => {Meteor.logout();}}>here</a> to logout</li>
                </ul>
            );
        } else {
            return (
                <ul>
                    <li>Click <a href="/join">here</a> to sign-up</li>
                    <li>Click <a href="/signin">here</a> to sign-in</li>
                </ul>
            );
        }
    }
}
