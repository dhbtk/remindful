import React, { useState } from 'react'
import LayoutContent from '../layout/DrawerLayout/LayoutContent'
import { FormattedMessage } from 'react-intl'
import LayoutContainer from '../layout/DrawerLayout/LayoutContainer'
import HabitForm from './HabitForm'
import { Redirect } from 'react-router-dom'

export default function NewHabitPage (): React.ReactElement {
  const [done, setDone] = useState(false)

  if (done) {
    return <Redirect to="/habits"/>
  } else {
    return (
      <LayoutContent title={<FormattedMessage id="NewHabitPage.title"/>} parentLink="/habits">
        <LayoutContainer maxWidth="sm">
          <HabitForm onClose={() => setDone(true)}/>
        </LayoutContainer>
      </LayoutContent>
    )
  }
}
