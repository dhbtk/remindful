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
  },
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0
  }
}))

interface Props extends ContainerProps {
  noPadding?: boolean
}

export default function LayoutContainer ({ className, children, noPadding, ...other }: Props): React.ReactElement {
  const isNoPadding = noPadding === false || noPadding === undefined
  const classes = useStyles()
  return (
    <Container className={clsx(classes.container, isNoPadding && classes.noPadding, className)} {...other}>
      {children}
    </Container>
  )
}
