import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import React, { useState } from 'react'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) => createStyles({
  content: {
    flex: '1',
    display: 'inline-flex',
    position: 'relative',
    '&:before': {
      left: 0,
      right: 0,
      bottom: 0,
      content: '""',
      position: 'absolute',
      pointerEvents: 'none',
      transition: 'border-bottom-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
      borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
    },
    '&:hover:before': {
      borderBottomColor: 'rgba(0, 0, 0, .87)'
    },
    '&:after': {
      left: 0,
      right: 0,
      bottom: 0,
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
      borderBottom: `2px solid ${theme.palette.primary.main}`,
      pointerEvents: 'none'
    }
  },
  contentFocused: {
    '&:after': {
      transform: 'scaleX(1)'
    }
  },
  contentInput: {
    flex: '1',
    outline: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: theme.spacing(0.5)
  },
  struck: {
    textDecoration: 'line-through',
    color: theme.palette.text.disabled
  }
}))

export interface ListInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  struck?: boolean
}

export default function ListInput ({
  value, onChange, onBlur = () => {
  }, onKeyPress = (e) => {
  }, struck = false
}: ListInputProps): React.ReactElement {
  const classes = useStyles()
  const [focused, setFocused] = useState(false)

  return (
    <div className={clsx(classes.content, focused && classes.contentFocused)}>
      <input type="text" className={clsx(classes.contentInput, struck && classes.struck)} value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          onBlur()
        }}
        onKeyPress={onKeyPress}/>
    </div>
  )
}
