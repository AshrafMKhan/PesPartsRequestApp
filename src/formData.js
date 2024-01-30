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
	fetch('./Parts.json').then(data => data.json()).then(data => {
		partsDataBase = data;
	});
};

export const fillFieldsWithData = () => {	//take data from the data object and put into corresponding fields on initial form load only
	if(formData['listOfRows'].length === 1){
		formData = JSON.parse(localStorage.getItem('formData'));
		//console.log('reloaded formData in ram from local storage');
	}

	//console.log('formData from ram: ' + JSON.stringify(formData));
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

	for(let row in rows){
		if(formData[row]['quan'] === '')return false;
		if(formData[row]['part'] === '')return false;
	}
	return true;
}

export const savePartsList = (fileName) => {
	localStorage.setItem('formData', JSON.stringify(formData));
	const serializedBody = JSON.stringify(formData);
	const fetchOptions = { 
	method: 'POST',
	headers: {
		"Content-Type": "application/json",
		
	},
	body: serializedBody
	};
	fetch('/savePartsList?fileName=' + fileName, fetchOptions).then(response => {
		if(response['ok'] === false)alert('Could not save the file. An error occured')
	}).catch(e => {console.log('an error occured while trying to write the file.')});
};
