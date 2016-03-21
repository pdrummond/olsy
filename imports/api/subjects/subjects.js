import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Subjects = new Mongo.Collection('Subjects');

Subjects.schema = new SimpleSchema({
    title: { type: String },
    type: {type: String},
    status: {type: String, defaultValue: 'open'},
    username: { type: String},
    projectId: { type: String, regEx: SimpleSchema.RegEx.Id},
    seq: {type: Number},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

Subjects.attachSchema(Subjects.schema);

Subjects.Type = {
    SUBJECT_TYPE_DISCUSSION: 'discussion',
    SUBJECT_TYPE_TASK: 'task'
};
