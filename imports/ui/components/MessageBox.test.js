import React from 'react';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

Meteor.methods({
  'test.resetDatabase': () => resetDatabase();
});

describe('MessageBox', done => {
  beforeEach(() => {
    // We need to wait until the method call is done before moving on, so we
    // use Mocha's async mechanism (calling a done callback)
    Meteor.call('test.resetDatabase', done);
  });

  it("should clear the content but keep the subject when the user taps the send button") {
      assert(false);
  });

  it("should update subjectTitle when user types into the subject input without affecting subjectType") {
       assert(false);
  });

  it("should update subjectTitle and subjectType when user selects an existing subject") {
       assert(false);
  });

  it("should reset subjectType and subjectTitle if user types into subject input when there is a selected subject") {
       assert(false);
  });

  it("should reset subjectType and subjectTitle if user selects a subject type when there is a selected subject") {
       assert(false);
  });

  //TODO: Needs more tests (and need to actually implement existing ones when Meteor 1.3 is released)

});
