import { createSlice } from "@reduxjs/toolkit";

interface darkModeState {
    isDark: boolean;
}

const initialState: darkModeState = {
    isDark: false,
}

const DarkModeSLice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDark = !state.isDark
        }
    }
});

export const { toggleDarkMode } = DarkModeSLice.actions;
export default DarkModeSLice.reducer;