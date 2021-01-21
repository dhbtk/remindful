import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { createStyles, ListItem, ListItemIcon, ListItemText, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

interface Props {
  icon: React.ReactNode
  primary: React.ReactNode
  to: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  current: {
    background: theme.palette.grey[200]
  }
}))

export default function ListItemLink (props: Props): React.ReactElement {
  const { icon, primary, to } = props
  const { pathname } = useLocation()
  const classes = useStyles()

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, any>((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to]
  )

  return (
    <li className={clsx(pathname === to && classes.current)}>
      <ListItem button component={CustomLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}
