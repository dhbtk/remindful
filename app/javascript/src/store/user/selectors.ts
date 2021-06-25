import { RootState } from '../rootReducer'

export const getInitialLoadState = (state: RootState): boolean => state.user.initialLoadDone
