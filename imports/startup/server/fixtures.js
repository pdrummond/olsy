import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects.js';
import { Items } from '../../api/items/items.js';

import {
    insertProject
} from '../../api/projects/methods.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    if (Projects.find().count() === 0) {
        const data = [
            {
                name: 'OpenLoops MVP',
                isFavourite: true,
                createdAt: new Date(),
                items: [
                    'Data on the Wire',
                    'One Language',
                    'Database Everywhere',
                    'Latency Compensation',
                    'Full Stack Reactivity',
                    'Embrace the Ecosystem',
                    'Simplicity Equals Productivity',
                ],
            },
            {
                name: 'Project 2',
                createdAt: new Date(),
                isFavourite: false,
                items: [
                    'Lisp',
                    'C',
                    'C++',
                    'Python',
                    'Ruby',
                    'JavaScript',
                    'Scala',
                    'Erlang',
                    '6502 Assembly',
                ],
            },
            {
                name: 'Project Three',
                createdAt: new Date(),
                isFavourite: false,
                items: [
                    'Ada Lovelace',
                    'Grace Hopper',
                    'Marie Curie',
                    'Carl Friedrich Gauss',
                    'Nikola Tesla',
                    'Claude Shannon',
                ],
            },
        ];

        let timestamp = (new Date()).getTime();

        data.forEach((project) => {
            //console.log("Adding test project " + JSON.stringify(project));
            const projectId = insertProject.call({
                name: project.name,
                isFavourite: project.isFavourite
            });
        });
        console.log("Inserted test projects: " + Projects.find().count());
    }
});
