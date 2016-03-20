import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { Subjects } from './subjects.js';

export const insertSubject = new ValidatedMethod({
    name: 'subjects.insertSubject',
    validate: new SimpleSchema({
        title: { type: String },
        type: {type: String},
        username: { type: String},
        projectId: { type: String, regEx: SimpleSchema.RegEx.Id}
    }).validator(),
    run({title, type, username, projectId}) {
        var now = new Date();
        var subject = {
            title,
            type,
            username,
            projectId,
            seq: Subjects.find().count()+1,
            createdAt: now,
            updatedAt: now
        };
        //validateSubject(this, subject, [checkIfSubjectKeyIsUnique]);
        var subjectId = Subjects.insert(subject);
        console.log("-- created subject " + subjectId);
        return subjectId;
    }
});

export const updateSubject = new ValidatedMethod({
    name: 'subjects.updateIsFavourite',
    validate: new SimpleSchema({
        subjectId: { type: String },
        type: { type: String }
    }).validator(),
    run({subjectId, type }) {
        //validateSubject(this, subjectId, [checkIfUserCanEdit]);
        var result = Subjects.update(subjectId, {
            $set: { type, updatedAt: new Date() },
        });
    }
});
