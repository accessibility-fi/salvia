import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SalviaReportSettings } from '../../../types/SalviaSettings'
import { RootState } from '../../store'

export interface SettingsState {
  status: 'idle' | 'loading' | 'failed'
  reportSettings: SalviaReportSettings
  //more settings to be added here
  //qualwebSettings
}

const initialState: SettingsState = {
  status: 'idle',
  reportSettings: { languages: ['finnish', 'swedish', 'english'], language: 'english' },
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.reportSettings.language = action.payload
    },
  },
})

export const { setLanguage } = settingsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectReportSettings = (state: RootState) => state.settings.reportSettings

export default settingsSlice.reducer
