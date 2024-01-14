import {useState} from 'react'
import { loadFormData, savePartsList } from './formData';
import PartsTable from './PartsTable';
import myDataStore from './myDataStore';
import { formData } from './formData';
import SavedFile from './SavedFile'

function FileNameGenerator(){
  
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
      localStorage.setItem('formData', JSON.stringify(data));
      localStorage.setItem('tableRows', data['listOfRows']);

      console.log('form data from local storage: ' + JSON.parse(localStorage.getItem('formData')));
      const serializedBody = JSON.stringify(data);  //myDataStore.getState().formData);
      const fetchOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: serializedBody // (5)
      };
      const fileName = systemType + '_' + moduleType + '_' + systemSerialNumber + '_' + moduleSerialNumber;
      localStorage.setItem('currentFileName', fileName);
      localStorage.setItem('router', 'loadTable')
      fetch('/savePartsList?fileName=' + fileName, fetchOptions).then(response => {
        if(response['ok'] === false)alert('Could not save the file. An error occured')

        //if(list.length === 1)setList([]);
        //else setList([0]);
        window.location.reload(false);  //refresh page

      }).catch(e => {console.log('an error occured while trying to write the file.')});
    });
  
  };

  const handleSavePartsList = (e) => {
    loadFormData();
    savePartsList(localStorage.getItem('currentFileName'));
  };

  const handleMakeNewFile = (e) => {
    localStorage.setItem('currentFileName', '');
    formData['listOfRows'] = [0];
    localStorage.setItem('router', 'newFileName');
    localStorage.setItem('currentFileName','');

    //if(list.length === 1)setList([]);
    //else setList([0]);
    window.location.reload(false);  //refresh page
  }

  const handleOpenFile = (e) => {
    localStorage.setItem('router', 'openFile')
    fetch('/getListOfPartsLists')
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('retrievedFiles', data['ListOfPartsLists']);
        data['ListOfPartsLists'].forEach(file => console.log(file));
        //if(list.length === 1)setList([]);
        //else setList([0]);
        window.location.reload(false);  //refresh the page
    }).catch(error =>{
      console.log('could not get a list of files.')
    });
  };

  return <div id='newpartslist'>
    Current Parts List: {localStorage.getItem('currentFileName')}
    {localStorage.getItem('router') === 'newFileName' || localStorage.getItem('router') === ''?
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
    :<></>}
    {localStorage.getItem('router') === 'loadTable'?<div><button onClick={handleMakeNewFile}>Make a new File</button><button onClick={handleOpenFile}>Open Existing File</button><button onClick={handleSavePartsList}>Save This File</button><br></br><PartsTable/></div>:<></>}
    {localStorage.getItem('router') === 'openFile'?<div><button onClick={handleMakeNewFile}>Make a new File</button><button onClick={handleOpenFile}>Open Existing File</button><button onClick={handleSavePartsList}>Save This File</button><br></br><SavedFile/></div>:<></>}
    </div>
}
export default FileNameGenerator;
