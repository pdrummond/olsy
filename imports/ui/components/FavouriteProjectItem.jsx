import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import ActionAssignmentLate from 'material-ui/lib/svg-icons/action/assignment-late';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Colors from 'material-ui/lib/styles/colors';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';

const ITEM_FAV_PROJECT = 'ITEM_FAV_PROJECT';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move'
};

const itemSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        };
    }
};

const itemTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        //props.moveItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

//TODO: This is duplicated from ProjectLister.
const iconButtonElement = (
    <IconButton touch={true}>
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);

class FavouriteProjectItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        debugger;
        const { connectDragSource, connectDropTarget, isDragging } = this.props;
        return connectDragSource(connectDropTarget(
            <div>
                <ListItem
                    key={this.props.project._id}
                    rightIconButton={
                        <IconMenu
                            iconButtonElement={iconButtonElement}
                            onItemTouchTap={this.onItemTouchTapped}>
                            <MenuItem ref="removeFavouriteMenuItem" value={this.props.project} > Remove star </MenuItem>
                            <Divider/>
                            {this.props.commonMenuItems}
                        </IconMenu>
                    }
                    primaryText={this.props.project.name}
                    leftIcon={<ActionGrade color={Colors.amber700}/>}
                    onTouchTap={this.props.onTouchTap}
                    />
            </div>
        ))
    }
}

FavouriteProjectItem.propTypes = {
    connectDropTarget: React.PropTypes.func.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired
};

var decoratedItem = flow(
    DropTarget(ITEM_FAV_PROJECT, itemTarget, collect),
    DragSource(ITEM_FAV_PROJECT, itemSource, collect)

)(FavouriteProjectItem);

console.log("decoratedItem: " + decoratedItem);

export default decoratedItem;
