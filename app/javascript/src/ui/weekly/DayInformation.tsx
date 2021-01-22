import React, { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { createStyles, Typography } from '@material-ui/core'
import PlannerEventList from '../plannerEvents/PlannerEventList'
import { makeStyles } from '@material-ui/core/styles'
import { useAppDispatch } from '../../store'
import { loadPlannerEvents } from '../../store/commonActions'
import linkRef from '../app/linkRef'
import { ymdToDate } from '../ymdUtils'

export interface Props {
  date: string
  presentDate: string
}

const useStyles = makeStyles((theme) => createStyles({
  dayName: {
    textAlign: 'center',
    marginBottom: theme.spacing(1),
    textDecoration: 'none',
    color: 'inherit',
    display: 'block'
  }
}))

export default function DayInformation ({ date }: Props): React.ReactElement {
  const intl = useIntl()
  const classes = useStyles()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadPlannerEvents(date)).catch(console.error)
  }, [dispatch, date])
  const to = `/daily/${date}`
  const CustomLink = useMemo(() => linkRef(to), [to, linkRef])
  return (
    <React.Fragment>
      <Typography variant="subtitle1" className={classes.dayName} component={CustomLink}>
        {intl.formatDate(ymdToDate(date), { weekday: 'long', month: 'numeric', day: 'numeric' })}
      </Typography>
      <PlannerEventList date={date}/>
    </React.Fragment>
  )
}
