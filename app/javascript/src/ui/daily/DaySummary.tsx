import React from 'react'
import { IconButton, Toolbar, Typography } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { ymdToDate } from '../ymdUtils'
import RefreshIcon from '@material-ui/icons/Refresh'

export interface DaySummaryProps {
  date: string
  onRefresh?: () => void
  loading?: boolean
}

export default function DaySummary ({ date, onRefresh, loading }: DaySummaryProps): React.ReactElement {
  return (
    <Toolbar variant="dense">
      <Typography component="h2" variant="h6" style={{ flexGrow: 1 }}>
        <FormattedMessage id="DaySummary.today" defaultMessage="{today, date, full}" values={{
          today: ymdToDate(date)
        }} />
      </Typography>
      {onRefresh !== undefined && (
        <IconButton color="inherit" size="small" onClick={onRefresh} disabled={loading === true}>
          <RefreshIcon/>
        </IconButton>
      )}
    </Toolbar>
  )
}
