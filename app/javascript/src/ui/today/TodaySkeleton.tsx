import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles, Typography } from '@material-ui/core'
import { themeColors } from '../App/App'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles((theme) => createStyles({
  dayName: {
    display: 'block',
    borderBottom: `1px solid ${themeColors.divider}`,
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: 0,
    marginTop: theme.spacing(3)
  },
  dayNameRow: {
    display: 'block',
    width: 120
  },
  row: {
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    borderBottom: `1px solid ${themeColors.divider}`
  }
}))

export const TodaySkeleton: React.FC = () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={classes.dayName}>
        <Typography variant="subtitle1" className={classes.dayNameRow}>
          <Skeleton />
        </Typography>
      </div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div className={classes.row} key={i}>
          <Typography variant="body2">
            <Skeleton />
          </Typography>
        </div>
      ))}
    </React.Fragment>
  )
}
