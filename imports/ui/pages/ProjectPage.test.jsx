import React from 'react';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

Meteor.methods({
  'test.resetDatabase': () => resetDatabase();
});

describe('ProjectPage', done => {
  beforeEach(() => {
    // We need to wait until the method call is done before moving on, so we
    // use Mocha's async mechanism (calling a done callback)
    Meteor.call('test.resetDatabase', done);
  });

  it("should display 4 projects in total") {
       assert(false);
  });

  it("should display favourite projects in a favourites section above the project list ") {
       assert(false);
  });

  it("should hide the favourites section if there is no favourites") {
      //Create set of projects with no favourites.
      //Check if the facourites section is in the DOM.
      assert(false);
  });

  it("should set favourite attribute to false if the user UNfavourites the project") {
     assert(false);
  });

  it("should set favourite attribute to true if the user favourites the project") {
     assert(false);
  });

  it("should un-dock sidebar and slide it out when the screen is resized to a smaller size") {
      //Is this a reasonable test?
      assert(false);
  });

  it("should automaticallty dock sidebar and slide it in when the screen is resized to a larger size") {
      //Is this a reasonable test?
      assert(false);
  });

  it("should display the sidebar un-docked and hidden on initial render on a small screen") {
      //Is this a reasonable test?
      assert(false);
  });

  it("should display the sidebar docked and visible on initial render on a large screen") {
      //Is this a reasonable test?
      assert(false);
  });


  it("should show a confirmation dialog when delete is selected") {
        //Is this a reasonable test?
        assert(false);
  });

  it("should re-position favourite projects when they are dragged up or down") {
      //How do we test something like this?
      //Maybe we don't test this but leave it here for information purposes?
      assert(false);
  });

  it("should order the favourite projects by the drag/drop order field") {
      assert(false);
  });

  it("should order the 'all projects' list alpabetically by name") {
      assert(false);
  });

  it("should scroll the project list when number of projects extends window height") {
      assert(false);
  });

});
