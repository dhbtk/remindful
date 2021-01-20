import React, {ChangeEvent} from 'react'
import {Box, Checkbox, createStyles, IconButton, TextField, Theme, Typography} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {PlannerEvent} from "../../store/common";
import {useAppDispatch} from "../../store";
import {reorderPlannerEvents, saveNewPlannerEvent, updateNewPlannerEvent} from '../../store/daily'
import {makeStyles} from "@material-ui/core/styles";
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {DragDropContext, Draggable, Droppable, DroppableProvided, DropResult} from "react-beautiful-dnd";
import ListInput from "../ListInput";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {completePlannerEvent, undoCompletePlannerEvent, updatePlannerEventText} from "../../store/plannerEvents";

export interface PlannerEventListProps {
  date: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  listContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  listItem: {
    display: 'flex',
    padding: 0,
    alignItems: 'center'
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center'
  }
}))

export default function PlannerEventList({date}: PlannerEventListProps) {
  const classes = useStyles()
  const plannerEvents = useSelector<RootState, PlannerEvent[]>(state => {
    if (state.daily.days[date] === undefined) {
      return []
    }
    return state.daily.days[date].plannerEventIds.map(id => state.plannerEvents.entities[id])
  })
  const pendingPlannerEvents = plannerEvents.filter(it => it.status === 'pending')
  const donePlannerEvents = plannerEvents.filter(it => it.status === 'done')
  const newPlannerEvent = useSelector<RootState, string | undefined>(state => state.daily.days[date]?.newPlannerEvent?.content) || ''
  const dispatch = useAppDispatch()
  const onTextChange = (e: string) => dispatch(updateNewPlannerEvent({date, content: e}))
  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.shiftKey && e.key === 'Enter') {
      dispatch(saveNewPlannerEvent(date))
      e.preventDefault()
    }
  }
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return
    }
    dispatch(reorderPlannerEvents(date, result.source.index, result.destination.index))
  }
  return (
    <React.Fragment>
      <Typography variant="h6">
        <FormattedMessage id="PlannerEventList.title" defaultMessage="{count} things to do"
                          values={{count: pendingPlannerEvents.length}}/>
      </Typography>
      {plannerEvents.length === 0 && (
        <Box style={{textAlign: 'center'}}>
          <FormattedMessage id="PlannerEventList.empty" defaultMessage="Nothing so far!"/>
        </Box>
      )}
      {plannerEvents.length !== 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided: DroppableProvided) => (
              <div className={classes.listContainer} ref={provided.innerRef} {...provided.droppableProps}>
                {pendingPlannerEvents.map((plannerEvent, index) => (
                  <Draggable draggableId={plannerEvent.id.toString()} index={index} key={plannerEvent.id}>
                    {(draggableProvided) => (
                      <div className={classes.listItem}
                           ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                        <div className={classes.actions}>
                          <span className={classes.dragHandle} {...draggableProvided.dragHandleProps}>
                            <DragHandleIcon/>
                          </span>
                          <Checkbox size="small" checked={false}
                                    onChange={() => dispatch(completePlannerEvent(plannerEvent.id))}/>
                        </div>
                        <ListInput value={plannerEvent.content}
                                   onChange={(text) => dispatch(updatePlannerEventText(plannerEvent.id, text))}/>
                        <div className={classes.actions}>
                          <IconButton size="small">
                            <DeleteIcon/>
                          </IconButton>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className={classes.listItem}>
        <div className={classes.actions}>
          <span className={classes.dragHandle}>
            <AddIcon/>
          </span>
        </div>
        <ListInput value={newPlannerEvent} onChange={onTextChange} onKeyPress={onKeyUp}/>
      </div>
      {donePlannerEvents.length > 0 && <Typography variant="h6">
        <FormattedMessage id="PlannerEventList.doneItems" defaultMessage="{count} done items"
                          values={{count: donePlannerEvents.length}}/>
      </Typography>}
      <div className={classes.listContainer}>
        {donePlannerEvents.map(plannerEvent => (
          <div className={classes.listItem} key={plannerEvent.id}>
            <div className={classes.actions}>
              <Checkbox size="small" checked onChange={() => dispatch(undoCompletePlannerEvent(plannerEvent.id))}/>
            </div>
            <ListInput struck value={plannerEvent.content}
                       onChange={(text) => dispatch(updatePlannerEventText(plannerEvent.id, text))}/>
            <div className={classes.actions}>
              <IconButton size="small">
                <DeleteIcon/>
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}
