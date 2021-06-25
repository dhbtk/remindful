import React, { Fragment, useEffect, useState } from 'react'
import { useAppDispatch } from '../../store'
import { use } from '../../store/use'
import { getInitialLoadState } from '../../store/user/selectors'
import { initialUserLoad } from '../../store/user/actions'

export const UserInformationLoader: React.FC = ({ children }) => {
  const dispatch = useAppDispatch()
  const initialLoadDone = use(getInitialLoadState)
  const [loadError, setLoadError] = useState(false)
  useEffect(() => {
    if (!initialLoadDone) {
      setLoadError(false)
      dispatch(initialUserLoad()).catch((err: any) => {
        console.error(err)
        setLoadError(true)
      })
    }
  }, [initialLoadDone])

  if (loadError) {
    return <div>Load error. Check console</div>
  }

  if (initialLoadDone) {
    return <Fragment>{children}</Fragment>
  } else {
    return <div>Loading...</div>
  }
}
