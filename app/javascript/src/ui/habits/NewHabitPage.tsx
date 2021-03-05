import React from 'react'
import LayoutContent from '../app/LayoutContent'
import { FormattedMessage } from 'react-intl'
import LayoutContainer from '../app/LayoutContainer'
import HabitForm from './HabitForm'

export default function NewHabitPage (): React.ReactElement {
  return (
    <LayoutContent title={<FormattedMessage id="NewHabitPage.title"/>} parentLink="/habits">
      <LayoutContainer maxWidth="sm">
        <HabitForm onClose={() => {}}/>
      </LayoutContainer>
    </LayoutContent>
  )
}
