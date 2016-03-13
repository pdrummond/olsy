import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { Items } from '../items/items.js';

class ProjectsCollection extends Mongo.Collection {
    insert(project, callback) {
        return super.insert(project, callback);
    }

    remove(selector, callback) {
        //Items.remove({ projectId: selector });
        return super.remove(selector, callback);
    }
}

export const Projects = new ProjectsCollection('Projects');

// Deny all client-side updates since we will be using methods to manage this collection
Projects.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

Projects.schema = new SimpleSchema({
    name: { type: String },
    userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
    isFavourite: {type: Boolean, defaultValue: false},
    key: {type: String},
    theme: {type: String, defaultValue: 'blue'},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    order: {type: Number}
});

Projects.attachSchema(Projects.schema);

// This represents the keys from Projects objects that should be published
// to the client. If we add secret properties to Project objects, don't project
// them here to keep them private to the server.
Projects.publicFields = {
    name: 1,
    isFavourite: 1,
    key: 1,
    theme: 1,
    userId: 1,
    createdAt: 1,
    updatedAt: 1,
    order: 1
};

Projects.helpers({

    // A project is considered to be private if it has a userId set
    isPrivate() {
        return !!this.userId;
    },

    isLastPublicProject() {
        const publicProjectCount = Projects.find({ userId: { $exists: false } }).count();
        return !this.isPrivate() && publicProjectCount === 1;
    },

    editableBy(userId) {
        if (!this.userId) {
            return true;
        }

        return this.userId === userId;
    },

    items() {
        return [];//Items.find({ projectId: this._id }, { sort: { createdAt: -1 } });
    },
});
