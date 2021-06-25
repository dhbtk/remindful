import React from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, ListItem, ListItemIcon, ListItemText, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import linkRef from '../../App/linkRef'
import { useAppDispatch } from '../../../store'
import { closeDrawer } from '../../../store/common/layout'
import { themeColors } from '../../App/App'

interface Props {
  icon: React.ReactNode
  primary: React.ReactNode
  to: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  current: {
    background: themeColors.divider
  }
}))

export default function ListItemLink (props: Props): React.ReactElement {
  const { icon, primary, to } = props
  const { pathname } = useLocation()
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const CustomLink = React.useMemo(
    () => linkRef(to),
    [to, linkRef]
  )
  const onClick = (): void => {
    dispatch(closeDrawer())
  }

  return (
    <li className={clsx(pathname === to && classes.current)}>
      <ListItem button component={CustomLink} onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}
