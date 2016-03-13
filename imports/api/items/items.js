import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Projects } from '../projects/projects.js';

class ItemsCollection extends Mongo.Collection {
    insert(doc, callback) {
        const ourDoc = doc;
        ourDoc.createdAt = ourDoc.createdAt || new Date();
        const result = super.insert(ourDoc, callback);
        incompleteCountDenormalizer.afterInsertItem(ourDoc);
        return result;
    }

    update(selector, modifier) {
        const result = super.update(selector, modifier);
        incompleteCountDenormalizer.afterUpdateItem(selector, modifier);
        return result;
    }

    remove(selector) {
        const items = this.find(selector).fetch();
        const result = super.remove(selector);
        incompleteCountDenormalizer.afterRemoveItems(items);
        return result;
    }
}

export const Items = new ItemsCollection('Items');

// Deny all client-side updates since we will be using methods to manage this collection
Items.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

Items.schema = new SimpleSchema({
    projectId: {
        type: String,
        //regEx: SimpleSchema.RegEx.Id,
        //denyUpdate: true,
    },
    text: {
        type: String,
        max: 100,
    },
    createdAt: {
        type: Date,
        denyUpdate: true,
    },
    checked: {
        type: Boolean,
        defaultValue: false,
    },
});

Items.attachSchema(Items.schema);

// This represents the keys from Projects objects that should be published
// to the client. If we add secret properties to Project objects, don't project
// them here to keep them private to the server.
Items.publicFields = {
    projectId: 1,
    text: 1,
    createdAt: 1,
    checked: 1,
};

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'item', 'emptyItem', 'checkedItem'
Factory.define('item', Items, {
    projectId: () => Factory.get('project'),
    text: () => faker.lorem.sentence(),
    createdAt: () => new Date(),
});

Items.helpers({

    project() {
        return Projects.findOne(this.projectId);
    },

    editableBy(userId) {
        return this.project().editableBy(userId);
    },
});
