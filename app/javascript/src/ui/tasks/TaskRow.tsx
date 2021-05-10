import { DraggableProvided } from 'react-beautiful-dnd'
import { Task } from '../../store/common'
import { useAppDispatch } from '../../store'
import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import { Checkbox, Chip, IconButton, Typography } from '@material-ui/core'
import { completeTask, deleteTask, dismissTask, undoCompleteTask } from '../../store/tasks'
import DeleteIcon from '@material-ui/icons/Delete'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import TaskForm from './TaskForm'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined'
import TaskDateDisplay from './TaskDateDisplay'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { ymdToDate } from '../ymdUtils'
import { themeColors } from '../App/App'

interface Props {
  draggableProvided: DraggableProvided
  task: Task
}

const useStyles = makeStyles(theme => createStyles({
  editing: {},
  root: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    '&:hover:not($editing) > $hidden': {
      visibility: 'visible'
    },
    '&:hover $gone': {
      display: 'inherit'
    }
  },
  hidden: {
    visibility: 'hidden',
    width: theme.spacing(4)
  },
  gone: {
    display: 'none'
  },
  main: {
    flex: '1',
    borderBottom: `1px solid ${themeColors.divider}`
  },
  tinyButton: {
    padding: '0'
  },
  tinyIcon: {
    width: '20px',
    height: '20px'
  },
  chips: {
    height: '40px',
    padding: theme.spacing(1),
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(0.5)
    },
    display: 'flex',
    alignItems: 'center'
  },
  mainRow: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    transition: 'color 300ms linear, text-decoration-color 300ms linear',
    textDecorationColor: 'rgba(0, 0, 0, 0)'
  },
  contentCompleted: {
    color: theme.palette.text.disabled,
    textDecorationColor: theme.palette.text.disabled,
    textDecoration: 'line-through'
  },
  checkbox: {
    padding: 0,
    marginRight: theme.spacing(1)
  },
  menuAction: {
    paddingLeft: theme.spacing(1)
  }
}))

export default function TaskRow ({ task, draggableProvided }: Props): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const toggleTaskCompletion = (): void => {
    if (task.status !== 'pending') {
      dispatch(undoCompleteTask(task.id))
    } else {
      dispatch(completeTask(task.id))
    }
  }
  const toggleTaskDismissed = (): void => {
    if (task.status !== 'pending') {
      dispatch(undoCompleteTask(task.id))
    } else {
      dispatch(dismissTask(task.id))
    }
  }

  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const isOverdue = task.status === 'pending' && (ymdToDate(todayDate) > ymdToDate(task.eventDate))

  return (
    <div className={clsx(classes.root, editing && classes.editing)} ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
      <div className={clsx(classes.hidden)}>
        <IconButton className={classes.tinyButton} {...draggableProvided.dragHandleProps} size="small">
          <DragHandleIcon className={classes.tinyIcon}/>
        </IconButton>
      </div>
      {editing ? (
        <div className={classes.main}>
          <TaskForm date={task.eventDate} onClose={() => setEditing(false)} task={task} />
        </div>
      ) : (
        <div className={classes.main}>
          <div className={classes.mainRow}>
            <Checkbox
              className={classes.checkbox}
              checked={task.status !== 'pending'}
              indeterminate={task.status === 'dismissed'}
              onChange={toggleTaskCompletion}
              size="small"
            />
            <Typography
              component="p"
              variant="body2"
              className={clsx(classes.content, task.status !== 'pending' && classes.contentCompleted)}
            >
              {task.content}
            </Typography>
            <IconButton
              className={clsx(classes.gone, classes.tinyButton)}
              size="small"
              onClick={() => setEditing(true)}>
              <EditOutlinedIcon className={classes.tinyIcon}/>
            </IconButton>
            <IconButton
              className={clsx(classes.gone, classes.tinyButton)}
              size="small"
              onClick={toggleTaskDismissed}>
              <IndeterminateCheckBoxIcon className={classes.tinyIcon}/>
            </IconButton>
          </div>
          <div className={classes.chips}>
            {isOverdue && <TaskDateDisplay task={task}/>}
            {/* <Chip label="chip" size="small" onDelete={() => {}}/> */}
            {/* <Chip label="chip" size="small" onDelete={() => {}}/> */}
            {/* <Chip label="chip" size="small" onDelete={() => {}}/> */}
          </div>
        </div>
      )}
      <div className={clsx(classes.hidden, classes.menuAction)}>
        <IconButton
          className={classes.tinyButton}
          onClick={() => dispatch(deleteTask(task.id))}
          size="small">
          <DeleteIcon className={classes.tinyIcon}/>
        </IconButton>
      </div>
    </div>
  )
}
