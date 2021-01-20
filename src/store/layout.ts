import { createSlice } from '@reduxjs/toolkit'

export interface LayoutState {
  drawerOpen: boolean
}

const initialState: LayoutState = {
  drawerOpen: false
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleDrawer (state: LayoutState) {
      state.drawerOpen = !state.drawerOpen
    }
  }
})

export const { toggleDrawer } = layoutSlice.actions
export default layoutSlice
