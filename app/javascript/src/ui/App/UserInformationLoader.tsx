import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { loadUserInfo } from '../../store/user/user'

export const UserInformationLoader: React.FC = () => {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector(state => state.user.accessToken)
  useEffect(() => {
    if (accessToken !== null) {
      dispatch(loadUserInfo()).catch(console.error)
    }
  }, [dispatch, accessToken])
  return <React.Fragment/>
}
