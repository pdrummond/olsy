import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ServerMessages = new Mongo.Collection('ServerMessages');

ServerMessages.schema = new SimpleSchema({
    content: { type: String },
    username: { type: String},
    projectId: { type: String, regEx: SimpleSchema.RegEx.Id},
    subjectId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
    seq: {type: Number},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

ServerMessages.attachSchema(ServerMessages.schema);
