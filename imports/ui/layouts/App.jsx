import React from 'react';
import { Meteor } from 'meteor/meteor';

export default App = React.createClass({

    getInitialState() {
        return {
            open: false
        };
    },

    handleToggle () {
        this.setState({open: ! this.state.open});
    },

    render() {
        return (
            <div className="app">
                {this.props.children || <p>Welcome to OpenLoops - click <a href="/welcome">here</a> to continue</p>}
            </div>
        );
    }
});

App.propTypes = {
    children: React.PropTypes.element // matched child route component
};

App.contextTypes = {
    router: React.PropTypes.object
};
