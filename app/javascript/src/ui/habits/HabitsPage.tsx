import React from 'react'
import LayoutContent from '../app/LayoutContent'
import { FormattedMessage } from 'react-intl'

export default function HabitsPage (): React.ReactElement {
  return (
    <LayoutContent title={<FormattedMessage id="HabitsPage.title"/>}>
      toolbar here for filtering
      table
    </LayoutContent>
  )
}
