import React from 'react';
import Colors from 'material-ui/lib/styles/colors';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import BugIcon from 'material-ui/lib/svg-icons/action/bug-report';
import TaskIcon from 'material-ui/lib/svg-icons/alert/error';
import DiscussionIcon from 'material-ui/lib/svg-icons/communication/chat';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';

import {parseMarkdown} from 'meteor/themeteorchef:commonmark';

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left">
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);
const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>New</MenuItem>
        <MenuItem>In Progress</MenuItem>
        <MenuItem>Done</MenuItem>
    </IconMenu>
);

const fruit = [
    'Apple', 'Apricot', 'Avocado',
    'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
    'Boysenberry', 'Blood Orange',
    'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
    'Coconut', 'Cranberry', 'Clementine',
    'Damson', 'Date', 'Dragonfruit', 'Durian',
    'Elderberry',
    'Feijoa', 'Fig',
    'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
    'Honeydew', 'Huckleberry',
    'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
    'Kiwi fruit', 'Kumquat',
    'Lemon', 'Lime', 'Loquat', 'Lychee',
    'Nectarine',
    'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
    'Olive', 'Orange',
    'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
    'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
    'Quince',
    'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
    'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
    'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
    'Ugli fruit',
    'Watermelon',
];

export default class SubjectDetailer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <List style={{backgroundColor: 'whitesmoke', borderBottom:'1px solid lightgray'}}>
                    <ListItem
                        primaryText={this.props.subject.title || ''}
                        leftAvatar={<Avatar icon={<DiscussionIcon />} backgroundColor={Colors.cyan900} />}
                        rightIconButton={rightIconMenu}
                        secondaryText={
                            <div>
                                <span className="key">{this.props.projectKey}-{this.props.subject.seq}: Created by pdrummond 2 minutes ago</span> <span className="label">open</span>
                            </div>
                        }
                        />
                </List>
                <div style={{display:'flex', padding:'0px 10px'}}>
                    <SelectField value={this.props.subject.type} onChange={this.handleChange} floatingLabelText="Type">
                        <MenuItem value={'discussion'} primaryText="Discussion"/>
                        <MenuItem value={'task'} primaryText="Task"/>
                    </SelectField>
                    <SelectField value={'open'} style={{marginLeft:'5px'}} onChange={this.handleChange} floatingLabelText="Status">
                        <MenuItem value={'open'} primaryText="Open"/>
                        <MenuItem value={'in-progress'} primaryText="In Progress"/>
                        <MenuItem value={'done'} primaryText="Done"/>
                    </SelectField>
                    <AutoComplete
                        style={{marginLeft:'5px'}}
                        floatingLabelText="Assignee"
                        filter={AutoComplete.fuzzyFilter}
                        triggerUpdateOnFocus={true}
                        dataSource={fruit}
                        />
                </div>
                <div style={{padding:'15px', marginTop:'5px'}}>
                    <span className='header-label'>Messages</span>
                    <List style={{padding:'10px'}}>
                        {this.renderSubjectMessages()}
                    </List>
                </div>
            </div>
        );
    }

    renderSubjectMessages() {
        var key=0;
        return this.props.subjectMessages.map(function(message) {
            return (
                <Card key={key++} className="subject-card">
                    <CardText>
                        <b>{message.username}</b><span style={{color:'gray'}}> 2 mins ago</span>
                        <div style={{marginTop:'10px'}} className="markdown-content" dangerouslySetInnerHTML={ this.getHtmlContent( message.content ) } />
                    </CardText>
                </Card>
            );
        }.bind(this));
    }

    getHtmlContent(content) {
        if ( content ) {
            return { __html: parseMarkdown(content) };
        }
    }
}
