import { DraggableProvided } from 'react-beautiful-dnd'
import { Task } from '../../store/common'
import { useAppDispatch } from '../../store'
import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import { Checkbox, Chip, IconButton, Typography } from '@material-ui/core'
import { completeTask, deleteTask, undoCompleteTask } from '../../store/tasks'
import DeleteIcon from '@material-ui/icons/Delete'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import TaskForm from './TaskForm'

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
    borderBottom: '1px solid rgba(0, 0, 0, .08)'
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
    }
  },
  mainRow: {
    display: 'flex'
  },
  content: {
    flexGrow: '1'
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
    if (task.status === 'done') {
      dispatch(undoCompleteTask(task.id))
    } else {
      dispatch(completeTask(task.id))
    }
  }
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
              checked={task.status === 'done'}
              onChange={toggleTaskCompletion}
              size="small"
            />
            <Typography component="p" variant="body2" className={classes.content}>{task.content}</Typography>
            <IconButton
              className={clsx(classes.gone, classes.tinyButton)}
              size="small"
              onClick={() => setEditing(true)}>
              <EditOutlinedIcon className={classes.tinyIcon}/>
            </IconButton>
          </div>
          <div className={classes.chips}>
            <Chip label="chip" size="small" onDelete={() => {}}/>
            <Chip label="chip" size="small" onDelete={() => {}}/>
            <Chip label="chip" size="small" onDelete={() => {}}/>
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
