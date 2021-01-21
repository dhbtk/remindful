import { ProviderContext, SnackbarKey, withSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { removeNotification, SnackNotification } from '../../store/layout'
import { useAppDispatch } from '../../store'

let displayed: SnackbarKey[] = []

function Notifier ({ enqueueSnackbar, closeSnackbar }: ProviderContext): React.ReactElement {
  const notifications = useSelector<RootState, SnackNotification[]>(store => store.layout.notifications)
  const dispatch = useAppDispatch()

  const storeDisplayed: (id: SnackbarKey) => void = (id) => {
    displayed = [...displayed, id]
  }

  const removeDisplayed: (id: SnackbarKey) => void = (id) => {
    displayed = [...displayed.filter(key => id !== key)]
  }

  useEffect(() => {
    notifications.forEach(({ key, message, options, dismissed = false }) => {
      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(key)
        return
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) return

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, myKey) => {
          options?.onClose?.(event, reason, myKey)
        },
        onExited: (event, myKey) => {
          // remove this snackbar from redux store
          dispatch(removeNotification(myKey))
          removeDisplayed(myKey)
        }
      })

      // keep track of snackbars that we've displayed
      storeDisplayed(key)
    })
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch])

  return <React.Fragment/>
}

export default withSnackbar(Notifier)
