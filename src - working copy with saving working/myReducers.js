import { createSlice } from '@reduxjs/toolkit'

export const appDataSlice = createSlice({
    name: 'appdata',
    initialState: {
			formData: {listOfRows: [0]},
      user: '',
      local_parts_database: {},
      local_database_loaded: false,
      isLoggedIn: false,
      current_parts_list: '',
      loaded_base_sheet: false,
    },
    reducers: {
			setFormData: (state, action) => {
				state.formData = action.payload;
				console.log('loaded formdata: ' + state.formData);
			},
      setLoadedBaseSheet: (state, action) => {
        state.loaded_base_sheet = action.payload;
      },
      setCurrentPartsList: (state, action) => {
        state.current_parts_list = action.payload;
      },
      clearCurrentPartsList: (state) => {
        state.current_parts_list = '';
      },
      setLocalPartsDatabase: (state, action)=> {
        state.local_parts_database = {...action.payload}
        console.log('loaded database into store: ' + state.local_parts_database);
        state.local_database_loaded = true;
      },
      signInUser: (state, action) => {
        
      },
      signOut: (state) => {
        state.isLoggedIn = false;
        state.user = {};
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setFormData, signInUser, signOut, setLocalPartsDatabase, setCurrentPartsList, clearCurrentPartsList, setNumberOfLines, setLoadedBaseSheet, setSaveAndReload, setOpenFile } = appDataSlice.actions
  
  export default appDataSlice.reducer