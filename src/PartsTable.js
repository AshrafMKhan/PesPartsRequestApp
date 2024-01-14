import { useEffect } from "react";
import { formData, loadPartsDatabase } from "./formData";
import { partsDataBase } from "./formData";
import { fillFieldsWithData } from "./formData";
import { isPartsAndQuantityFull } from "./formData";
import { useState } from "react";
import { useDispatch } from "react-redux";


function PartsTable(){
	//const dispatch = useDispatch();

	const [list, setList] = useState([0]);		//used for forcing rerendering
	if(partsDataBase === undefined){
		loadPartsDatabase();		//reload the parts lookup database if it's not loaded in memory
		console.log('Reloading parts database into ram')
	}
	const handleInputChange = (e) => {
		const id = e.target.id;
		const row = Number(id.slice(4));
		const typeOfInput = id.slice(0,4);
		if(isPartsAndQuantityFull() === true){
			const rows = localStorage.getItem('tableRows').split(',');
			rows.push(rows.length);
			localStorage.setItem('tableRows', rows);
			if(list.length === 1)setList([]);	//cause rerender of component
      else setList([0]);
			//window.location.reload(false);	//refresh page
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
		fillFieldsWithData();	
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
					{localStorage.getItem('tableRows').split(',').map(row => <tr key={'k'+row}><td><input id={'quan'+row} type='text' onChange={handleInputChange}/></td><td><input id={'part'+row} type='text' onChange={handleInputChange}/></td><td><input id={'desc'+row} type='text' onChange={handleInputChange}/></td><td><input id={'lctn'+row} type='text' onChange={handleInputChange}/></td><td><input id={'cost'+row} type='text' onChange={handleInputChange}/></td><td><input id={'prce'+row} type='text' onChange={handleInputChange}/></td><td><input id={'rmrk'+row} type='text' onChange={handleInputChange}/></td></tr> )}
				</tbody>
      </table>
		</div>
	);
}
export default PartsTable;
