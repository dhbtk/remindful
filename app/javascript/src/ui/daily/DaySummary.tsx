import React from 'react'
import { Toolbar, Typography } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { ymdToDate } from '../ymdUtils'

export interface DaySummaryProps {
  date: string
}

export default function DaySummary ({ date }: DaySummaryProps): React.ReactElement {
  return (
    <Toolbar variant="dense">
      <Typography component="h2" variant="h6">
        <FormattedMessage id="DaySummary.today" defaultMessage="{today, date, full}" values={{
          today: ymdToDate(date)
        }} />
      </Typography>
    </Toolbar>
  )
}
