import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import crawlerReducer from './reducers/crawler/crawlerSlice'
import qualwebReducer from './reducers/qualweb/qualwebSlice'
import salviaReducer from './reducers/salvia/salviaSlice'
import reportReducer from './reducers/report/reportSlice'
import settingsReducer from './reducers/settings/settingsSlice'
import testReducer from './reducers/salvia/testSlice'

export const store = configureStore({
  reducer: {
    crawler: crawlerReducer,
    qualweb: qualwebReducer,
    salvia: salviaReducer,
    report: reportReducer,
    settings: settingsReducer,
    test: testReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
