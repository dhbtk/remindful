import React, { useMemo } from 'react'
import LayoutContent from '../app/LayoutContent'
import { FormattedMessage } from 'react-intl'
import LayoutContainer from '../app/LayoutContainer'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import linkRef from '../app/linkRef'

export default function HabitsPage (): React.ReactElement {
  const NewHabitLink = useMemo(() => linkRef('/habits/new'), [linkRef])
  return (
    <LayoutContent title={<FormattedMessage id="HabitsPage.title"/>}>
      <LayoutContainer maxWidth="lg">
        oie gente!!!
        <Fab color="primary" component={NewHabitLink} aria-label="add">
          <AddIcon/>
        </Fab>
      </LayoutContainer>
    </LayoutContent>
  )
}
