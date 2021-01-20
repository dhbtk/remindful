import React from 'react'
import { Link } from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

interface Props {
  icon: React.ReactNode
  primary: React.ReactNode
  to: string
}

export default function ListItemLink (props: Props): React.ReactElement {
  const { icon, primary, to } = props

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, any>((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to]
  )

  return (
    <li>
      <ListItem button component={CustomLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}
