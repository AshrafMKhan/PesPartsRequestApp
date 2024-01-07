import { configureStore } from '@reduxjs/toolkit'
import appDataReducers from './myReducers'

export default configureStore({
  // reducer: {accountHandlers: accountReducer}
  reducer: appDataReducers
})
