import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ClientMessages = new Mongo.Collection(null); //Null ensures client-only collection

ClientMessages.schema = new SimpleSchema({
    content: { type: String },
    username: { type: String},
    projectId: { type: String, regEx: SimpleSchema.RegEx.Id},
    subjectId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
    seq: {type: Number},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

ClientMessages.attachSchema(ClientMessages.schema);
