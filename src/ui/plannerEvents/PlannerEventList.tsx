import React from 'react'
import { Box, Checkbox, createStyles, IconButton, Theme, Typography } from '@material-ui/core'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { PlannerEvent } from '../../store/common'
import { useAppDispatch } from '../../store'
import { reorderPlannerEvents, saveNewPlannerEvent, updateNewPlannerEvent } from '../../store/daily'
import { makeStyles } from '@material-ui/core/styles'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import ListInput from '../ListInput'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import {
  completePlannerEvent,
  deletePlannerEvent,
  undoCompletePlannerEvent,
  updatePlannerEventText
} from '../../store/plannerEvents'
import clsx from 'clsx'
import yellow from '@material-ui/core/colors/yellow'

export interface PlannerEventListProps {
  date: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    '&:not(:empty)': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.23)'
    }
  },
  listItem: {
    display: 'flex',
    padding: theme.spacing(0.5),
    alignItems: 'center'
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center'
  },
  overdue: {
    background: yellow[100]
  }
}))

export default function PlannerEventList ({ date }: PlannerEventListProps): React.ReactElement {
  const classes = useStyles()
  const plannerEvents = useSelector<RootState, PlannerEvent[]>(state => {
    if (state.daily.days[date] === undefined) {
      return []
    }
    return state.daily.days[date].plannerEventIds.map(id => state.plannerEvents.entities[id])
  })
  const pendingPlannerEvents = plannerEvents.filter(it => it.status === 'pending')
  const donePlannerEvents = plannerEvents.filter(it => it.status === 'done')
  const newPlannerEvent = useSelector<RootState, string | undefined>(state => state.daily.days[date]?.newPlannerEvent?.content) ?? ''
  const dispatch = useAppDispatch()
  const onTextChange: (e: string) => void = (e: string) => dispatch(updateNewPlannerEvent({ date, content: e }))
  const onKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => void = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      dispatch(saveNewPlannerEvent(date))
    }
  }
  const onDragEnd: (result: DropResult) => void = async (result: DropResult) => {
    if (result.destination === undefined || result.destination.index === result.source.index) {
      return
    }
    dispatch(reorderPlannerEvents(date, result.source.index, result.destination.index))
  }
  const intl = useIntl()
  return (
    <React.Fragment>
      <Typography variant="h6">
        <FormattedMessage
          id="PlannerEventList.title"
          defaultMessage="{count} things to do"
          values={{ count: pendingPlannerEvents.length }}/>
      </Typography>
      {plannerEvents.length === 0 && (
        <Box style={{ textAlign: 'center' }}>
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
                      <div
                        className={clsx(classes.listItem, plannerEvent.originalDate !== null && classes.overdue)}
                        ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                        <div className={classes.actions}>
                          <span className={classes.dragHandle} {...draggableProvided.dragHandleProps}>
                            <DragHandleIcon/>
                          </span>
                          <Checkbox
                            size="small"
                            checked={false}
                            onChange={async () => dispatch(completePlannerEvent(plannerEvent.id))}/>
                        </div>
                        <ListInput
                          value={plannerEvent.content}
                          onChange={async (text) => dispatch(updatePlannerEventText(plannerEvent.id, text))}/>
                        <div className={classes.actions}>
                          <IconButton size="small" onClick={() => dispatch(deletePlannerEvent(plannerEvent.id))}>
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
        <ListInput
          placeholder={intl.formatMessage({ id: 'PlannerEventList.newPlannerEvent', defaultMessage: 'New entry' })}
          value={newPlannerEvent}
          onChange={onTextChange}
          onKeyPress={onKeyUp}/>
      </div>
      {donePlannerEvents.length > 0 && <Typography variant="h6">
        <FormattedMessage
          id="PlannerEventList.doneItems"
          defaultMessage="{count} done items"
          values={{ count: donePlannerEvents.length }}/>
      </Typography>}
      <div className={classes.listContainer}>
        {donePlannerEvents.map(plannerEvent => (
          <div className={classes.listItem} key={plannerEvent.id}>
            <div className={classes.actions}>
              <Checkbox
                size="small"
                checked
                onChange={async () => dispatch(undoCompletePlannerEvent(plannerEvent.id))}/>
            </div>
            <ListInput
              struck
              value={plannerEvent.content}
              onChange={async (text) => dispatch(updatePlannerEventText(plannerEvent.id, text))}/>
            <div className={classes.actions}>
              <IconButton size="small" onClick={() => dispatch(deletePlannerEvent(plannerEvent.id))}>
                <DeleteIcon/>
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}
