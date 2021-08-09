import React, { useEffect } from 'react'
import { useAppDispatch } from '../../store'
import { setTodayDate } from '../../store/common/daily'
import { ymd } from '../ymdUtils'

export const DayTimer: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setTodayDate(ymd(new Date())))
    const interval = setInterval(() => dispatch(setTodayDate(ymd(new Date()))), 1000)
    return () => clearInterval(interval)
  }, [dispatch])

  return <React.Fragment/>
}
