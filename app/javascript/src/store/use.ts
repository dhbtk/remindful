import { ParametricSelector } from 're-reselect'
import { RootState } from './rootReducer'
import { useAppSelector } from './index'
import { shallowEqual } from 'react-redux'

export function use<Props, Result> (selector: ParametricSelector<RootState, Props, Result>, props?: Props): Result {
  return useAppSelector(state => selector(state, props as Props), shallowEqual)
}
