import { Container, ContainerProps } from '@material-ui/core'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => createStyles({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flex: '1',
    background: theme.palette.background.paper
  }
}))

export default function LayoutContainer ({ className, children, ...other }: ContainerProps): React.ReactElement {
  const classes = useStyles()
  return (
    <Container className={clsx(classes.container, className)} {...other}>
      {children}
    </Container>
  )
}
