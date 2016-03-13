import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';

import { Items } from './items.js';
import { Projects } from '../projects/projects.js';

const incompleteCountDenormalizer = {

    _updateProject(projectId) {
        // Recalculate the correct incomplete count direct from MongoDB
        const incompleteCount = Items.find({
            projectId,
            checked: false,
        }).count();

        Projects.update(projectId, { $set: { incompleteCount } });
    },

    afterInsertItem(item) {
        this._updateProject(item.projectId);
    },

    afterUpdateItem(selector, modifier) {
        // We only support very limited operations on items
        check(modifier, { $set: Object });

        // We can only deal with $set modifiers, but that's all we do in this app
        if (_.has(modifier.$set, 'checked')) {
            Items.find(selector, { fields: { projectId: 1 } }).forEach(item => {
                this._updateProject(item.projectId);
            });
        }
    },

    // Here we need to take the project of items being removed, selected *before* the update
    // because otherwise we can't figure out the relevant project id(s) (if the item has been deleted)
    afterRemoveItems(items) {
        items.forEach(item => this._updateProject(item.projectId));
    },
};

export default incompleteCountDenormalizer;
