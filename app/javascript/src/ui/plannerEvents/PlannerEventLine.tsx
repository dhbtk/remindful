import { DraggableProvided } from 'react-beautiful-dnd'
import { PlannerEvent } from '../../store/common'
import { useAppDispatch } from '../../store'
import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import { Checkbox, Chip, IconButton, Typography } from '@material-ui/core'
import { completePlannerEvent, deletePlannerEvent, undoCompletePlannerEvent } from '../../store/plannerEvents'
import DeleteIcon from '@material-ui/icons/Delete'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import PlannerEventForm from './PlannerEventForm'

interface Props {
  draggableProvided: DraggableProvided
  plannerEvent: PlannerEvent
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

export default function PlannerEventLine ({ plannerEvent, draggableProvided }: Props): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const togglePlannerEvent = (): void => {
    if (plannerEvent.status === 'done') {
      dispatch(undoCompletePlannerEvent(plannerEvent.id))
    } else {
      dispatch(completePlannerEvent(plannerEvent.id))
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
          <PlannerEventForm date={plannerEvent.eventDate} onClose={() => setEditing(false)} plannerEvent={plannerEvent} />
        </div>
      ) : (
        <div className={classes.main}>
          <div className={classes.mainRow}>
            <Checkbox
              className={classes.checkbox}
              checked={plannerEvent.status === 'done'}
              onChange={togglePlannerEvent}
              size="small"
            />
            <Typography component="p" variant="body2" className={classes.content}>{plannerEvent.content}</Typography>
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
          onClick={() => dispatch(deletePlannerEvent(plannerEvent.id))}
          size="small">
          <DeleteIcon className={classes.tinyIcon}/>
        </IconButton>
      </div>
    </div>
  )
}
