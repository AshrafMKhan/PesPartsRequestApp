import {useState} from 'react'
import {formData} from './formData';
import { loadListOfCommonParts, loadFormData, savePartsList } from './formData';
import PartsTable from './PartsTable';
import { appState } from './formData';
import myDataStore from './myDataStore';
import { useDispatch } from 'react-redux';
import { setFormData, setCurrentPartsList } from './myReducers';
function FileNameGenerator(){
  const dispatch = useDispatch();
  const [list, setList] = useState([0]);
  const [systemType, setSystemType] = useState('MX6100');
  const handleSystemChange = (event) => {
    event.preventDefault();
    setSystemType(event.target.value);
  };
  const [moduleType, setModuleType] = useState('Input_Hopper');
  const handleModuleChange = (event) => {
    event.preventDefault();
    setModuleType(event.target.value);
  };
  const [systemSerialNumber, setSystemSerialNumber] = useState('');
  const handleSystemSerialNumberChange = (event) => {
    event.preventDefault();
    setSystemSerialNumber(event.target.value);
  };
  const [moduleSerialNumber, setModuleSerialNumber] = useState('');
  const handleModuleSerialNumberChange = (event) => {
    event.preventDefault();
    setModuleSerialNumber(event.target.value);
  };
  const createPartsList = (e) => {
    e.preventDefault();
    fetch('./common_parts/MX6100_Input_Hopper').then(data => data.json()).then(data => {
      dispatch(setFormData(data));
      const serializedBody = JSON.stringify(myDataStore.getState().formData);
      const fetchOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: serializedBody // (5)
      };
      const fileName = systemType + '_' + moduleType + '_' + systemSerialNumber + '_' + moduleSerialNumber;
      dispatch(setCurrentPartsList(fileName));
      fetch('/savePartsList?fileName=' + fileName, fetchOptions).then(response => {
        if(response['ok'] === false)alert('Could not save the file. An error occured')
        // if(list.length === 1)setList([]);
        // else setList([0]);
      }).catch(e => {console.log('an error occured while trying to write the file.')});
    });
      // if(list.length === 1)setList([]);
      // else setList([0]);
  
  };

  const savePartsList = (e) => {
    loadFormData();
    savePartsList(appState['fileName']);
  };

  return <div id='newpartslist'>
    Current Parts List: {myDataStore.getState().current_parts_list}
    {!myDataStore.getState().current_parts_list?
      <div>
        
        <label>System Type:
          <select value={systemType} onChange={handleSystemChange}>
            <option value="MX6100">MX6100</option>
            <option value="MX6000">MX6000</option>
            <option value="MX2100">MX2100</option>
          </select>
        </label>
        <label>Module Type: 
          <select value={moduleType} onChange={handleModuleChange}>
            <option value="Input_Hopper">Input Hopper</option>
            <option value="MagStripe">Mag Stripe</option>
            <option value="Cleaning">Cleaning Module</option>
          </select>
        </label>
        <label>System Serial# <input value={systemSerialNumber} type='text' onChange={handleSystemSerialNumberChange} /></label>
        <label>Module Serial# <input value={moduleSerialNumber} type='text' onChange={handleModuleSerialNumberChange} /></label>
        <button onClick={createPartsList}>Create parts list</button>
      </div>
    :<div><button>Open Existing File</button><button onClick={savePartsList}>Save This File</button></div>} 
    {/* {?<PartsTable/>:<></>} */}
    </div>
}
export default FileNameGenerator;
