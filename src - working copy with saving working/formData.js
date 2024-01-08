import { useDispatch } from "react-redux";
import { setFormData } from "./myReducers";
import myDataStore from "./myDataStore";

export let formData = {
	listOfRows: [0],
};
export let partsDataBase;
export const appState = {
	fileName: '',
	hideFileNameGenerator: false,
	showTableButtons: false,

};

export const loadPartsDatabase = () => {	//load the parts database into the local environment if it's not loaded
	fetch('./parts_database.json').then(data => data.json()).then(data => {
		partsDataBase = data;
		console.log('loaded database: ' + Object.keys(partsDataBase))
	});
};
/*
export const loadListOfCommonParts = (fileName) => {	//load data from a json object in a file and load into the local object
	fetch('./common_parts/' + fileName).then(data => data.json()).then(data => {
		formData = data;
		console.log('loaded common parts into formData.');
		console.log('formData:' + JSON.stringify(formData));
		return data;
		//const dispatch = useDispatch();
		//dispatch(setFormData(formData));
		//localStorage.setItem('formData', JSON.stringify(data));
	});

	
}
*/
export const fillFieldsWithData = () => {	//take data from the data object and put into corresponding fields on initial form load only
	if(formData['listOfRows'].length === 1)formData = JSON.parse(localStorage.getItem('formData'));
	formData.listOfRows.forEach(row => {
		if(formData[row] !== undefined){
			document.querySelector('#quan'+row).value = formData[row]['quan']
			document.querySelector('#part'+row).value = formData[row]['part'] 
			document.querySelector('#desc'+row).value = formData[row]['desc']
			document.querySelector('#lctn'+row).value = formData[row]['lctn']
			document.querySelector('#cost'+row).value = formData[row]['cost']
			document.querySelector('#prce'+row).value = formData[row]['prce']
			document.querySelector('#rmrk'+row).value = formData[row]['rmrk']
	
		}
	});
}
export const loadFormData = () => {	//load data from the existing fields into the data object for saving purposes
	const rows = localStorage.getItem('tableRows').split(',');
	rows.forEach(row => {
	//formData.listOfRows.forEach(row => {
		if(formData[row] === undefined)formData[row] = {};
		formData[row]['quan'] = document.querySelector('#quan'+row).value;
		formData[row]['part'] = document.querySelector('#part'+row).value;
		formData[row]['desc'] = document.querySelector('#desc'+row).value;
		formData[row]['lctn'] = document.querySelector('#lctn'+row).value;
		formData[row]['cost'] = document.querySelector('#cost'+row).value;
		formData[row]['prce'] = document.querySelector('#prce'+row).value;
		formData[row]['rmrk'] = document.querySelector('#rmrk'+row).value;
		
	});
	formData['listOfRows'] = localStorage.getItem('tableRows').split(',');
	return rows;
};

export const isPartsAndQuantityFull = () => {
	const rows = loadFormData();

	console.log('running ispartsAndQuantityFull');
	for(let row in rows){
		if(formData[row]['quan'] === '')return false;
		if(formData[row]['part'] === '')return false;
	}
	return true;
}

export const savePartsList = (fileName) => {
	localStorage.setItem('formData', JSON.stringify(formData));
	//localStorage.setItem('tableRows', formData['listOfRows']);
	const serializedBody = JSON.stringify(formData);
	const fetchOptions = { 
	method: 'POST',
	headers: {
		"Content-Type": "application/json",
		// 'Content-Type': 'application/x-www-form-urlencoded',
	},
	body: serializedBody
	};
	fetch('/savePartsList?fileName=' + fileName, fetchOptions).then(response => {
		if(response['ok'] === false)alert('Could not save the file. An error occured')
	}).catch(e => {console.log('an error occured while trying to write the file.')});
};
