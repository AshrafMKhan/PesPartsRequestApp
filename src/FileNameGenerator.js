import {useState} from 'react'
import {formData} from './formData';
import { loadListOfCommonParts } from './formData';
import PartsTable from './PartsTable';
import { appState } from './formData';

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
    loadListOfCommonParts('MX6100_Input_Hopper');
    const serializedBody = JSON.stringify(formData);//['10\t233\tball bearing\n5\t333\tmotor\n8\t999\tsensor']); // (2) in notes below
    const fetchOptions = { // (3)
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }, // (4)
    body: serializedBody // (5)
    };
		const fileName = systemType + '_' + moduleType + '_' + systemSerialNumber + '_' + moduleSerialNumber;
    appState['fileName'] = fileName;
    fetch('/savePartsList?fileName=' + fileName, fetchOptions).then(response => {
			if(response['ok'] === false)alert('Could not save the file. An error occured')
	    appState['hideFileNameGenerator'] = true;
      if(list.length === 1)setList([]);
      else setList([0]);
    }).catch(e => {console.log('an error occured while trying to write the file.')});
  };
  return <div id='newpartslist'>
    {!appState['hideFileNameGenerator']?
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
    :<div>{appState['fileName']}<button>Open Existing File</button><button>Save This File</button></div>} 
    {appState['fileName']?<PartsTable/>:<></>}
    </div>
}
export default FileNameGenerator;
