import { formData } from "./formData";
import { useTable } from 'react-table';
import React from "react";
import './FileDrawer.css';


function SavedFile(){

	//-------------------------------------------------------------------------------
//trying useTable
//create a list of objects for the file names
const listOfFilesNames = localStorage.getItem('retrievedFiles').split(',');
const listOfFilesNamesConvertedForHook = [];
for(let file in listOfFilesNames){
	const obj = {}
	const listOfCols = listOfFilesNames[file].split('_')
	obj['System Type'] = listOfCols[0];
	obj['Module Type'] = listOfCols[1];
	obj['System Serial#'] = listOfCols[2];
	obj['Module Serial#'] = listOfCols[3];
	listOfFilesNamesConvertedForHook.push(obj);
}
	console.log('listing listOfFilesNamesConvertedForHook')
	listOfFilesNamesConvertedForHook.forEach(obj => {
		console.log(obj['System Type']);
		console.log(obj['Module Type']);
		console.log(obj['System Serial#']);
		console.log(obj['Module Serial#']);
		
	});
console.log('listOfFilesNamesConvertedForHook: ' + listOfFilesNamesConvertedForHook[0]['System Type']);
const data = React.useMemo(() =>	{
	return listOfFilesNamesConvertedForHook}
// [
// {
// name: 'Kim Parrish',
// address: '4420 Valley Street, Garnerville, NY 10923',
// date: '07/11/2020',
// order: '87349585892118',
// },
// {
// name: 'Michele Castillo',
// address: '637 Kyle Street, Fullerton, NE 68638',
// date: '07/11/2020',
// order: '58418278790810',
// },
// {
// name: 'Eric Ferris',
// address: '906 Hart Country Lane, Toccoa, GA 30577',
// date: '07/10/2020',
// order: '81534454080477',
// },
// {
// name: 'Gloria Noble',
// address: '2403 Edgewood Avenue, Fresno, CA 93721',
// date: '07/09/2020',
// order: '20452221703743',
// },
// {
// name: 'Darren Daniels',
// address: '882 Hide A Way Road, Anaktuvuk Pass, AK 99721',
// date: '07/07/2020',
// order: '22906126785176',
// },
// {
// name: 'Ted McDonald',
// address: '796 Bryan Avenue, Minneapolis, MN 55406',
// date: '07/07/2020',
// order: '87574505851064',
// },
// ],

)

const columns = React.useMemo(
 () => [
 {
 Header: 'Types',
 columns: [
 {
 Header: 'System Type',
 accessor: 'System Type',
 },
 {
 Header: 'Module Type',
 accessor: 'Module Type',
 },
 ],
 },
 {
 Header: 'Serial Numbers',
 columns: [
 {
 Header: 'System Serial#',
 accessor: 'System Serial#',
 },
 {
 Header: 'Module Serial#',
 accessor: 'Module Serial#',
 },
 ],
 },
 ],
 []
)
const {
 getTableProps,
 getTableBodyProps,
 headerGroups,
 rows,
 prepareRow,
} = useTable({ columns, data })

//--------------------------------------------------------------------------------

	const handlClick = file => {
		const filename = file['original']['System Type'] + '_' +
										 file['original']['Module Type'] + '_' +
										 file['original']['System Serial#'] + '_' +
										 file['original']['Module Serial#'];
		console.log('fileName: ' + filename);
		formData['listOfRows'] = [0];
		console.log('filename: ' + filename);
		localStorage.setItem('router', 'loadTable'); 
		localStorage.setItem('currentFileName',filename);
		fetch('./saved_parts_lists/'+filename).then(data => data.json()).then(data => {
      localStorage.setItem('formData', JSON.stringify(data));
      localStorage.setItem('tableRows', data['listOfRows']);
			window.location.reload(false);	//refresh page
		});
	};

	const handleDoubleClick = file => {
		formData['listOfRows'] = [0];
		console.log('filename: ' + file);
		localStorage.setItem('router', 'loadTable'); 
		localStorage.setItem('currentFileName',file);
		fetch('./saved_parts_lists/'+file).then(data => data.json()).then(data => {
      localStorage.setItem('formData', JSON.stringify(data));
      localStorage.setItem('tableRows', data['listOfRows']);
			window.location.reload(false);	//refresh page
		});

		
	};
	return (
		<div>
			<table {...getTableProps()}>
				<thead >
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
						<th {...column.getHeaderProps()}>{column.render('Header')}</th>
					))}
					</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map(row => { console.log('row: ' + JSON.stringify(row))
						prepareRow(row)
						return (
							<tr onClick={ e => {handlClick(row)}} {...row.getRowProps()}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
					</tbody>
			</table>
		{/* <table>
			<thead style={{textAlign: 'center'}}>
				<tr>
					<th>System Type</th>
					<th>Module Type</th>
					<th>System Serial Number</th>
					<th>Module Serial Number</th>
				</tr>
			</thead>
			<tbody style={{textAlign: 'center'}}>
				{localStorage.getItem('retrievedFiles').split(',').map(file => <tr key={file} onDoubleClick={e => {handleDoubleClick(file)}} >{file.split('_').map(unit => <td key={file+unit}>{unit}</td>)}</tr>)}			
			</tbody>
		</table> */}
	</div>
	);
}
export default SavedFile;