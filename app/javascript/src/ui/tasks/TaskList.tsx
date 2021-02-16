import React, { useState } from 'react'
import { Button, createStyles, Theme } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { Task } from '../../store/common'
import { useAppDispatch } from '../../store'
import { reorderTasks } from '../../store/daily'
import { makeStyles } from '@material-ui/core/styles'
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import AddIcon from '@material-ui/icons/Add'
import { differenceInCalendarDays } from 'date-fns'
import { ymdToDate } from '../ymdUtils'
import TaskRow from './TaskRow'
import TaskForm from './TaskForm'

interface TaskListProps {
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

export default function TaskList ({ date, overdue }: TaskListProps): React.ReactElement {
  const classes = useStyles()
  const isOverdue = overdue !== undefined && overdue
  const tasks = useSelector<RootState, Task[]>(state => {
    if (isOverdue) {
      return state.tasks.overdueIds.map(id => state.tasks.entities[id])
    }
    return state.daily.days[date]?.taskIds?.map(id => state.tasks.entities[id]) ?? []
  })
  const dispatch = useAppDispatch()
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const isPastDate = isOverdue || differenceInCalendarDays(ymdToDate(todayDate), ymdToDate(date)) > 0
  const onDragEnd: (result: DropResult) => void = async (result: DropResult) => {
    if (result.destination === undefined || result.destination.index === result.source.index) {
      return
    }
    dispatch(reorderTasks(isOverdue ? null : date, result.source.index, result.destination.index))
  }
  const [creating, setCreating] = useState(false)
  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided: DroppableProvided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task, index) => (
                <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                  {(draggableProvided) => (
                    <TaskRow
                      draggableProvided={draggableProvided}
                      task={task}/>
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
          {creating && <TaskForm date={date} onClose={() => setCreating(false)}/>}
          {!creating && (
            <Button variant="outlined" color="primary" size="small" startIcon={<AddIcon/>} onClick={() => setCreating(true)}>
              <FormattedMessage id="TaskList.newTask" />
            </Button>
          )}
        </div>
      )}
    </React.Fragment>
  )
}
