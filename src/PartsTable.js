import { useEffect } from "react";
import { formData, loadFormData, loadPartsDatabse } from "./formData";
import { partsDataBase } from "./formData";
import { fillFieldsWithData } from "./formData";
import { isPartsAndQuantityFull } from "./formData";
import { useState } from "react";

function PartsTable(){
	const [list, setList] = useState([0]);		//used for forcing rerendering
	//console.log('formData: ' + formData['listOfRows']);
	//console.log('local storage type: ' + typeof localStorage.getItem('rows'));
	//formData['listOfRows'] = localStorage.getItem('rows').split(',');
	if(formData['listOfRows'].length === 1)formData = JSON.parse(localStorage.getItem('formData'));		//reload the inital form data if not loaded
	if(partsDataBase === undefined)loadPartsDatabse();		//reload the parts lookup database if it's not loaded in memory
	const handleInputChange = (e) => {
		const id = e.target.id;
		const row = Number(id.slice(4));
		const typeOfInput = id.slice(0,4);
		if(isPartsAndQuantityFull() === true){
			formData['listOfRows'].push(formData['listOfRows'].length);
			console.log('table needs to grow');
			if(list.length === 1)setList([]);
      else setList([0]);
		}
		if(typeOfInput === 'part' && e.target.value.length === 3){
			const enteredPartNumberDescription = partsDataBase[e.target.value];
			if(enteredPartNumberDescription !== undefined)
			document.querySelector('#desc'+row).value = partsDataBase[e.target.value]['description']; 
			else document.querySelector('#desc'+row).value = 'part not found';
		}
		if(formData[row] === undefined)formData[row] = {};
		formData[row][typeOfInput] = e.target.value;
	};
	useEffect(()=>{
		if(document.querySelector('#part'+formData['listOfRows'][formData['listOfRows'].length-1]) === null){
			console.log('missing field found')
			if(list.length === 1)setList([]);
      else setList([0]);
		}
		//setTimeout(() => {
			fillFieldsWithData();	
		//}, 300);
	});
	return (
		<div>
			<table>
      	<thead>
					<tr>
						<th>Quantity</th>
						<th>Part Number</th>
						<th>Part Description</th>
						<th>Location</th>
						<th>Cost</th>
						<th>Price</th>
						<th>Remarks</th>
					</tr>
        </thead>
        <tbody>
					{formData['listOfRows'].map(row => <tr key={'k'+row}><td><input id={'quan'+row} type='text' onChange={handleInputChange}/></td><td><input id={'part'+row} type='text' onChange={handleInputChange}/></td><td><input id={'desc'+row} type='text' onChange={handleInputChange}/></td><td><input id={'lctn'+row} type='text' onChange={handleInputChange}/></td><td><input id={'cost'+row} type='text' onChange={handleInputChange}/></td><td><input id={'prce'+row} type='text' onChange={handleInputChange}/></td><td><input id={'rmrk'+row} type='text' onChange={handleInputChange}/></td></tr> )}
				</tbody>
      </table>
		</div>
	);
}
export default PartsTable;
