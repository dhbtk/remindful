import React from 'react'
import { Typography } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { ymdToDate } from '../ymdUtils'

export interface DaySummaryProps {
  date: string
}

export default function DaySummary ({ date }: DaySummaryProps): React.ReactElement {
  return (
    <React.Fragment>
      <Typography variant="h3">
        <FormattedMessage id="DaySummary.today" defaultMessage="{today, date, full}" values={{
          today: ymdToDate(date)
        }} />
      </Typography>
    </React.Fragment>
  )
}
