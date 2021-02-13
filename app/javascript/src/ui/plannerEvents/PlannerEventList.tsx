import React, { useState } from 'react'
import { Button, createStyles, Theme } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { PlannerEvent } from '../../store/common'
import { useAppDispatch } from '../../store'
import { reorderPlannerEvents } from '../../store/daily'
import { makeStyles } from '@material-ui/core/styles'
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import AddIcon from '@material-ui/icons/Add'
import { differenceInCalendarDays } from 'date-fns'
import { ymdToDate } from '../ymdUtils'
import PlannerEventLine from './PlannerEventLine'
import PlannerEventForm from './PlannerEventForm'

export interface PlannerEventListProps {
  date: string
  overdue?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  formWrapper: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginTop: theme.spacing(0.5)
  }
}))

export default function PlannerEventList ({ date, overdue }: PlannerEventListProps): React.ReactElement {
  const classes = useStyles()
  const isOverdue = overdue !== undefined && overdue
  const plannerEvents = useSelector<RootState, PlannerEvent[]>(state => {
    if (isOverdue) {
      return state.plannerEvents.overdueIds.map(id => state.plannerEvents.entities[id])
    }
    if (state.daily.days[date] === undefined) {
      return []
    }
    return state.daily.days[date].plannerEventIds.map(id => state.plannerEvents.entities[id])
  })
  const dispatch = useAppDispatch()
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const isPastDate = isOverdue || differenceInCalendarDays(ymdToDate(todayDate), ymdToDate(date)) > 0
  const onDragEnd: (result: DropResult) => void = async (result: DropResult) => {
    if (result.destination === undefined || result.destination.index === result.source.index) {
      return
    }
    dispatch(reorderPlannerEvents(isOverdue ? null : date, result.source.index, result.destination.index))
  }
  const [creating, setCreating] = useState(false)
  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided: DroppableProvided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {plannerEvents.map((plannerEvent, index) => (
                <Draggable draggableId={plannerEvent.id.toString()} index={index} key={plannerEvent.id}>
                  {(draggableProvided) => (
                    <PlannerEventLine
                      draggableProvided={draggableProvided}
                      plannerEvent={plannerEvent}/>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {!isPastDate && (
        <div className={classes.formWrapper}>
          {creating && <PlannerEventForm date={date} onClose={() => setCreating(false)}/>}
          {!creating && (
            <Button variant="outlined" color="primary" size="small" startIcon={<AddIcon/>} onClick={() => setCreating(true)}>
              <FormattedMessage id="PlannerEventList.newPlannerEvent" />
            </Button>
          )}
        </div>
      )}
    </React.Fragment>
  )
}
