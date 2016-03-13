/* eslint-env mocha */

import { Factory } from 'meteor/dburles:factory';
import { Projects } from './projects.js';
import { chai, assert, expect } from 'meteor/practicalmeteor:chai';
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
    describe('projects', () => {
        const createProjects = () => {
            Projects.insert({_id:"1", name:"Project One", isFavourite:true});
            Projects.insert({_id:"2", name:"Project Two", isFavourite:false});
            Projects.insert('project', {_id:"3", name:"Project Three", isFavourite:false});
            Projects.insert('project', {_id:"4", name:"Project Four", isFavourite:true});
        };

        before(() => {
            Projects.remove({});
            createProjects();
        });

        it('should contain 4 projects', () => {
            expect(Projects.find().count()).to.equal(4);
        });

        it('builds correctly from factory', () => {
            const project = Factory.create('project');
            assert.typeOf(project, 'object');
            expect(project.isFavourite).to.be.false;
            expect(project.theme).to.equal('blue');
        });

        it('sorts projects by favourites first', () => {
            //TODO: The sort criteria shouldn't be specified here - should be using a publication for this
            //but this is enough to get the intent across for now until I can test publications.
            var projects = Projects.find({}, {sort: [['isFavourite', -1], ['createdAt',1]]}).fetch();
            console.log("projects:" + JSON.stringify(projects));
            //expect(projects.length).to.equal(4);
            expect(projects[0]._id).to.equal("1");
            expect(projects[1]._id).to.equal("4");

        });

    });

    describe('project.insert method', () => {
        it('should automatically set the order field to the next number in the sequence');
        it('should not allow a project to be created with a duplicate key');
        it('should automatically set key to uppercase first 3 letters of project if key is not provided');

    });
}
