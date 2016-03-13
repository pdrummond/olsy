import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export function createContainer(options = {}, Component) {
  let expandedOptions = options;
  if (typeof options === 'function') {
    expandedOptions = {
      getMeteorData: options,
    };
  }

  const {
    getMeteorData,
    pure = true,
  } = expandedOptions;

  const mixins = [ReactMeteorData];
  if (pure) {
    mixins.push(PureRenderMixin);
  }

  /* eslint-disable react/prefer-es6-class */
  return React.createClass({
    displayName: 'MeteorDataContainer',
    mixins,
    getMeteorData() {
      return getMeteorData(this.props);
    },
    render() {
      return <Component {...this.props} {...this.data}/>;
    },
  });
}
