import {useState} from 'react'
import { loadFormData, savePartsList } from './formData';
import PartsTable from './PartsTable';
import { formData } from './formData';
import SavedFile from './SavedFile'

function FileNameGenerator(){
  document.refreshed = true;
  const [list, setList] = useState(false);
  if(localStorage.getItem('router') === null)localStorage.setItem('router', '');
  const [other, setOther] = useState(false);
  const [otherModule, setOtherModule] = useState(false);
  //const [list, setList] = useState([0]);
  const [systemType, setSystemType] = useState('MX6100');
  const handleSystemChange = (event) => {
    event.preventDefault();
    if(event.target.value === 'Other'){
      setOther(true);
    }
    setSystemType(event.target.value);
  };
  const handleSystemNameInput = (event) => {
    event.preventDefault();
    setSystemType(event.target.value);
  };

  const [moduleType, setModuleType] = useState('InputHopper');
  const handleModuleChange = (event) => {
    event.preventDefault();
    if(event.target.value === 'Other'){
      setOtherModule(true);
    }
    setModuleType(event.target.value);
  };
  const handleModuleNameInput = (event) => {
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
  const createPartsList = (e) => {  //put data in local storage
    document.refreshed = false;
    e.preventDefault();
    
    fetch('./common_parts/' + systemType + '_' + moduleType).then(data => {
      if(!data.ok)console.log('Could not load defaults sheet.');  //handle no defaults sheet found
      localStorage.setItem('formData', JSON.stringify({listOfRows:[0]}));
      localStorage.setItem('tableRows', [0]);
      const fileName = (systemType + '_' + moduleType + '_' + systemSerialNumber + '_' + moduleSerialNumber).replace(/[ ]/g,'-');
      const serializedBody = JSON.stringify({listOfRows:[0]});
      const fetchOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          
        },
        body: serializedBody // (5)
        };
      localStorage.setItem('currentFileName', fileName);
      localStorage.setItem('router', 'loadTable')
      fetch('/savePartsList?fileName=' + fileName +'&path=saved_parts_lists/', fetchOptions).then(response => { //save the file with the data from the default parts sheet
        if(response['ok'] === false)alert('Could not save the file. An error occured')

        if(list.length === 1)setList([]); //rerender
        else setList([0]);
        //window.location.reload(false);  //refresh page


      }).catch(e => {console.log('an error occured while trying to write the file.')});


      return data.json()}).then(data => {  //load the file with the deafaull parts
      localStorage.setItem('formData', JSON.stringify(data));
      localStorage.setItem('tableRows', data['listOfRows']);
      console.log('document.refreshed: ' + document.refreshed);
      //end load the file with the deafault parts

      const serializedBody = JSON.stringify(data);  
      const fetchOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        
      },
      body: serializedBody // (5)
      };
      const fileName = (systemType + '_' + moduleType + '_' + systemSerialNumber + '_' + moduleSerialNumber).replace(/[ ]/g,'-');
      
      localStorage.setItem('currentFileName', fileName);
      localStorage.setItem('router', 'loadTable')
      fetch('/savePartsList?fileName=' + fileName +'&path=saved_parts_lists/', fetchOptions).then(response => { //save the file with the data from the default parts sheet
        if(response['ok'] === false)alert('Could not save the file. An error occured')

        if(list.length === 1)setList([]); //rerender
        else setList([0]);
        //window.location.reload(false);  //refresh page


      }).catch(e => {console.log('an error occured while trying to write the file.')});
    });
    console.log('document.refreshed: ' + document.refreshed);

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
      .then((res) => {if(!res.ok)alert('could not get the list of files.');return res.json()})
      .then((data) => {
        localStorage.setItem('retrievedFiles', data['ListOfPartsLists']);
        //data['ListOfPartsLists'].forEach(file => console.log(file));
        //if(list.length === 1)setList([]);
        //else setList([0]);
        window.location.reload(false);  //refresh the page
    }).catch(error =>{
      //console.log('could not get a list of files.')
    });
  };

  const handleRenameFile = (e) => {
    localStorage.setItem('router','renameFile');
    window.location.reload(false);
  };

  const handleSaveFileName = (e) => {
    //console.log('renameing file')
    const fileName = (systemType + '_' + moduleType + '_' + systemSerialNumber + '_' + moduleSerialNumber).replace(/[ ]/g,'-');
    fetch('/renameFile?currentFileName='+localStorage.getItem('currentFileName')+'&newFileName='+fileName).then(data => {if(!data.ok)alert('could not rename the file.');return data.text()}).then(data => {
      //console.log('file rename response: ' + data);
      localStorage.setItem('currentFileName', fileName);
      localStorage.setItem('router', 'loadTable')
      window.location.reload(false);
    });
  };

  const saveDefaultsSheet = (e) => {
    const fileName = (systemType + '_' + moduleType);
    loadFormData();
    savePartsList(fileName,'common_parts/');
  };

  const openDefaultsSheet = (e) => {
    const fileName = (systemType + '_' + moduleType);
    fetch('./common_parts/' + fileName).then(data => {if(!data.ok)alert('That deaults sheet does not exist.\nOr the sever is down.');return data.json()}).then(data => {  //load the file with the deafault parts
      localStorage.setItem('formData', JSON.stringify(data));
      localStorage.setItem('tableRows', data['listOfRows']);
      localStorage.setItem('defaultsSheet', fileName);
      window.location.reload(false);
      // if(list.length === 1)setList([]);
      // else setList([0]);
    });

  };




  return <div id='newpartslist'>
    <h3 style={{textAlign: 'center', width:'1265px'}}>{localStorage.getItem('currentFileName')}</h3>
    {localStorage.getItem('router') === 'newFileName' || localStorage.getItem('router') === '' || localStorage.getItem('router') === 'renameFile'?
      <div>{localStorage.getItem('router') === 'newFileName' || localStorage.getItem('router') === ''?<div style={{textAlign:'center'}}><button onClick={handleOpenFile}>Open Existing File</button>
      <button onClick={e => {localStorage.setItem('router', 'createDefaultsSheet'); localStorage.setItem('currentFileName','');
      localStorage.setItem('formData', JSON.stringify({listOfRows:[0]}));
      localStorage.setItem('tableRows', [0]);
      
      window.location.reload(false);}}>Create Deafault Parts Sheet</button></div>:<></>}<br></br>
        
        <label>System Type:
          {other? <input onChange={handleSystemNameInput}/> :<select value={systemType} onChange={handleSystemChange}>
            <option value="MX6100">MX6100</option>
            <option value="MX6000">MX6000</option>
            <option value="MX2100">MX2100</option>
            <option value="MX2000">MX2000</option>
            <option value="MX1100">MX1100</option>
            <option value="MX1000">MX1000</option>
            <option value="MXDClassic">MXDClassic</option>
            <option value="MXD610">MXD610</option>
            <option value="MXDLite110">MXDLite110</option>
            <option value="MXDLite210">MXDLite210</option>
            <option value="MXI210">MXI210</option>
            <option value="MXI110">MXI110</option>
            <option value="DC9000">DC900000</option>
            <option value="DC7000">DC700000</option>
            <option value="DC500">DC500</option>
            <option value="UltraForm">UltraForm</option>
            <option value="UltraPac">UltraPac</option>
            <option value="DC150I">DC150I</option>
            <option value="DC4x0">DC4x0</option>
            <option value="DC2x0">DC2x0</option>
            <option value="Matica">Matica</option>
            <option value="Other">Other</option>
          </select>}
        </label>
        <label>Module Type: 
          {otherModule? <input onChange={handleModuleNameInput}/> : <select value={moduleType} onChange={handleModuleChange}>
            <option value="InputHopper">Input Hopper</option>
            <option value="MagStripe">Mag Stripe</option>
            <option value="Cleaning">Cleaning Module</option>
            <option value="FrontGfx">Front Gfx</option>
            <option value="RearGfx">Rear Gfx</option>
            <option value="ColorGfx">Color Gfx</option>
            <option value="SmartCardBarrel">SmartCard Barrel</option>
            <option value="SmartCardRack">SmartCard Rack</option>
            <option value="Emboss">Emboss</option>
            <option value="Topper">Topper</option>
            <option value="Topcoat">Topcoat</option>
            <option value="CardGuard">Card Guard</option>
            <option value="Other">Other</option>
          </select>}
        </label>
        <label>System Serial# <input style={{border:'solid black 1px'}} value={systemSerialNumber} type='text' onChange={handleSystemSerialNumberChange} /></label>
        <label>Module Serial# <input style={{border:'solid black 1px'}} value={moduleSerialNumber} type='text' onChange={handleModuleSerialNumberChange} /></label>
        {localStorage.getItem('router') === 'renameFile'?<button onClick={handleSaveFileName}>Save File Name</button> :<button onClick={createPartsList}>Create parts list</button>}
      </div>
    :<></>}
    {localStorage.getItem('router') === 'loadTable' || localStorage.getItem('router') === 'renameFile'?<div style={{width: '1265px', textAlign:'center'}}><button onClick={handleMakeNewFile}>Make a new File</button><button onClick={handleOpenFile}>Open Existing File</button><button onClick={handleSavePartsList}>Save This File</button><button onClick={handleRenameFile}>Rename File</button><br></br><br></br><PartsTable/></div>:<></>}
    {localStorage.getItem('router') === 'openFile'?<div><button onClick={handleMakeNewFile}>Make a new File</button><br></br><SavedFile/></div>:<></>}
    {localStorage.getItem('router') === 'createDefaultsSheet'?
      <div>
          <h1 style={{textAlign:'center'}}>{localStorage.getItem('defaultsSheet')}</h1>
        <label>System Type:
        {other? <input onChange={handleSystemNameInput}/> :<select value={systemType} onChange={handleSystemChange}>
          
          <option value="MX6100">MX6100</option>
          <option value="MX6000">MX6000</option>
          <option value="MX2100">MX2100</option>
          <option value="MX2000">MX2000</option>
          <option value="MX1100">MX1100</option>
          <option value="MX1000">MX1000</option>
          <option value="MXDClassic">MXDClassic</option>
          <option value="MXD610">MXD610</option>
          <option value="MXDLite110">MXDLite110</option>
          <option value="MXDLite210">MXDLite210</option>
          <option value="MXI210">MXI210</option>
          <option value="MXI110">MXI110</option>
          <option value="DC9000">DC900000</option>
          <option value="DC7000">DC700000</option>
          <option value="DC500">DC500</option>
          <option value="UltraForm">UltraForm</option>
          <option value="UltraPac">UltraPac</option>
          <option value="DC150I">DC150I</option>
          <option value="DC4x0">DC4x0</option>
          <option value="DC2x0">DC2x0</option>
          <option value="Matica">Matica</option>
          <option value="Other">Other</option>
        </select>}
      </label>
      <label>Module Type: 
        {otherModule? <input onChange={handleModuleNameInput}/> : <select value={moduleType} onChange={handleModuleChange}>
          <option value="InputHopper">Input Hopper</option>
          <option value="MagStripe">Mag Stripe</option>
          <option value="Cleaning">Cleaning Module</option>
          <option value="FrontGfx">Front Gfx</option>
          <option value="RearGfx">Rear Gfx</option>
          <option value="ColorGfx">Color Gfx</option>
          <option value="SmartCardBarrel">SmartCard Barrel</option>
          <option value="SmartCardRack">SmartCard Rack</option>
          <option value="Emboss">Emboss</option>
          <option value="Topper">Topper</option>
          <option value="Topcoat">Topcoat</option>
          <option value="CardGuard">Card Guard</option>
          <option value="Other">Other</option>
        </select>}
      </label><button onClick={openDefaultsSheet}>Open Deafualts Sheet</button><button onClick={saveDefaultsSheet}>Save Deafualts Sheet</button><br></br>
      <button onClick={handleMakeNewFile}>Make a new File</button><button onClick={handleOpenFile}>Open Existing File</button>
      <PartsTable/>

    </div>
    :<></>}
    </div>
}
export default FileNameGenerator;
