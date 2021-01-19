import React, {ChangeEvent} from 'react'
import {Box, Checkbox, createStyles, TextField, Theme, Typography} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {PlannerEvent} from "../../store/common";
import {useAppDispatch} from "../../store";
import {reorderPlannerEvents, saveNewPlannerEvent, updateNewPlannerEvent} from '../../store/daily'
import {makeStyles} from "@material-ui/core/styles";
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {DragDropContext, Draggable, Droppable, DroppableProvided, DropResult} from "react-beautiful-dnd";

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
    padding: 0
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center'
  },
  content: {
    flex: '1',
    display: 'flex',
    alignItems: 'center'
  },
  contentInput: {
    flex: '1',
    outline: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: theme.spacing(1),
    '&:after': {
      left: 0,
      right: 0,
      bottom: 0,
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
      borderBottom: `2px solid ${theme.palette.primary}`,
      pointerEvents: 'none'
    }
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
  const newPlannerEvent = useSelector<RootState, string | undefined>(state => state.daily.days[date]?.newPlannerEvent?.content) || ''
  const dispatch = useAppDispatch()
  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => dispatch(updateNewPlannerEvent({ date, content: e.target.value }))
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
      <Typography variant="h5">
        <FormattedMessage id="PlannerEventList.title" defaultMessage="Things to do"/>
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
                {plannerEvents.map((plannerEvent, index) => (
                  <Draggable draggableId={plannerEvent.id.toString()} index={index} key={plannerEvent.id}>
                    {(draggableProvided) => (
                      <div className={classes.listItem} ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                        <div className={classes.actions}>
                          <span className={classes.dragHandle} {...draggableProvided.dragHandleProps}>
                            <DragHandleIcon />
                          </span>
                          <Checkbox checked={plannerEvent.status === 'done'}/>
                        </div>
                        <div className={classes.content}>
                          <input type="text" className={classes.contentInput} value={plannerEvent.content} />
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
      <TextField label={<FormattedMessage id="PlannerEventList.newPlannerEvent" defaultMessage="New entry"/>}
                 variant="filled" multiline value={newPlannerEvent} onChange={onTextChange} onKeyPress={onKeyUp}/>
    </React.Fragment>
  )
}
