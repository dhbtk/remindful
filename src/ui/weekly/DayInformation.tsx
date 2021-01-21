import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { createStyles, Typography } from '@material-ui/core'
import { parse } from 'date-fns'
import PlannerEventList from '../plannerEvents/PlannerEventList'
import { makeStyles } from '@material-ui/core/styles'
import { useAppDispatch } from '../../store'
import { loadPlannerEvents } from '../../store/commonActions'

export interface Props {
  date: string
  presentDate: string
}

const useStyles = makeStyles((theme) => createStyles({
  dayName: {
    textAlign: 'center',
    marginBottom: theme.spacing(1)
  }
}))

export default function DayInformation ({ date }: Props): React.ReactElement {
  const intl = useIntl()
  const classes = useStyles()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadPlannerEvents(date)).catch(console.error)
  }, [dispatch, date])
  return (
    <React.Fragment>
      <Typography variant="subtitle1" className={classes.dayName}>
        {intl.formatDate(parse(date, 'yyyy-MM-dd', new Date()), { weekday: 'long', month: 'numeric', day: 'numeric' })}
      </Typography>
      <PlannerEventList date={date}/>
    </React.Fragment>
  )
}
