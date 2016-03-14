import React from 'react';
import Colors from 'material-ui/lib/styles/colors';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import SprintIcon from 'material-ui/lib/svg-icons/maps/directions-run';
import BugIcon from 'material-ui/lib/svg-icons/action/bug-report';
import TaskIcon from 'material-ui/lib/svg-icons/alert/error';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import LinearProgress from 'material-ui/lib/linear-progress';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

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

function wrapState(ComposedComponent) {
    const StateWrapper = React.createClass({
        getInitialState() {
            return {selectedIndex: 1};
        },
        handleUpdateSelectedIndex(e, index) {
            this.setState({
                selectedIndex: index,
            });
        },
        render() {
            return (
                <ComposedComponent
                    {...this.props}
                    {...this.state}
                    valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}
                    />
            );
        },
    });
    return StateWrapper;
}

SelectableList = wrapState(SelectableList);

export default class ProjectPlanner extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <SelectableList
                value={3}
                subheader={
                    <div>
                        <span style={{fontSize:'16px'}}>Milestone 1: Version 0.1</span><span style={{textAlign:'right'}} className="milestone-complete-label">30% complete</span>
                    </div>

                }
                >
                <LinearProgress mode="determinate" value={70} style={{height:'10px'}} color={Colors.purpleA400}/>
                <ListItem
                    value={1}
                    primaryText="Sprint 1"
                    secondaryText= {
                        <div>
                            <span className="complete-label">30% complete</span><span>01/03/2015 - 11/03/2015 | <b>2 open/2 closed</b></span>
                        </div>
                    }
                    leftAvatar={<Avatar icon={<SprintIcon />} backgroundColor={Colors.cyan900} />}
                    nestedItems={[
                        <ListItem
                            value={2}
                            primaryText="OLS-6: Implement planner"
                            leftAvatar={<Avatar icon={<TaskIcon />} backgroundColor={Colors.yellow600} />}
                            rightIconButton={rightIconMenu}
                            secondaryText={
                                <div>
                                    <span className="label">open</span><span>The planner needs to be implemeneteddk faksdjf kldj fkajsdk fjfask djfkf jdfkdsjf</span>
                                </div>
                                }
                                />,
                            <ListItem
                                value={3}
                                primaryText="OLS-77: Fix sidebar scroll bug"
                                leftAvatar={<Avatar icon={<BugIcon />} backgroundColor={Colors.blue500} />}
                                rightIconButton={rightIconMenu}
                                />,
                        ]}/>
                    <ListItem
                        value={4}
                        primaryText="Sprint 2"
                        secondaryText= "14/03/2015 - 25/03/2015"
                        leftAvatar={<Avatar icon={<SprintIcon />} backgroundColor={Colors.cyan900} />}
                        />
                    <ListItem
                        value={5}
                        primaryText="Sprint 3"
                        secondaryText= "28/03/2015 - 08/04/2015"
                        leftAvatar={<Avatar icon={<SprintIcon />} backgroundColor={Colors.cyan900} />}
                        />
                </SelectableList>
            );
        }
    }
