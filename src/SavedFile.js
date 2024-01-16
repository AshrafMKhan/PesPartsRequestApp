import { formData } from "./formData";
import { useTable, useSortBy, useFilters } from 'react-table';
import React from "react";
import './FileDrawer.css';

function SavedFile(){
	//-------------------------------------------------------------------------------
//trying useTable
//create a list of objects for the file names
const defaultColumn = React.useMemo(
	() => ({
		Filter: TextFilter,
	}),
	[]
 )
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
	listOfFilesNamesConvertedForHook.forEach(obj => {
	});
const data = React.useMemo(() =>	{
	return listOfFilesNamesConvertedForHook},[]);
const columns = React.useMemo(
 () => [
 {
 Header: 'Types',
 columns: [
 {
 Header: 'System Type',
 accessor: 'System Type',
 sortType: 'basic',
 },
 {
 Header: 'Module Type',
 accessor: 'Module Type',
 sortType: 'basic',
 },
 ],
 },
 {
 Header: 'Serial Numbers',
 columns: [
 {
 Header: 'System Serial#',
 accessor: 'System Serial#',
 sortType: 'basic',
 },
 {
 Header: 'Module Serial#',
 accessor: 'Module Serial#',
 sortType: 'basic',
 },
 ],
 },
 ],
 []
)

const {
	getTableBodyProps,
	getTableProps,
	headerGroups,
	rows,
	getRowProps,
	prepareRow,
 } = useTable(
	{
		columns,
		data,
		defaultColumn,
	},
	useFilters,useSortBy,
 )

 function TextFilter({
	column: { filterValue, preFilteredRows, setFilter },
 }) {
	const count = preFilteredRows.length
 
	return (
		<input
			value={filterValue || ''}
			onChange={e => {
				setFilter(e.target.value || undefined)
			}}
			placeholder={`Search ${count} records...`}
		/>
	)
 }
//--------------------------------------------------------------------------------

	const handleDoubleClick = file => {
		const filename = file['original']['System Type'] + '_' +
										 file['original']['Module Type'] + '_' +
										 file['original']['System Serial#'] + '_' +
										 file['original']['Module Serial#'];
		//console.log('fileName: ' + filename);
		formData['listOfRows'] = [0];
		//console.log('filename: ' + filename);
		localStorage.setItem('router', 'loadTable'); 
		localStorage.setItem('currentFileName',filename);
		fetch('./saved_parts_lists/'+filename).then(data => data.json()).then(data => {
      localStorage.setItem('formData', JSON.stringify(data));
      localStorage.setItem('tableRows', data['listOfRows']);
			window.location.reload(false);	//refresh page
		});
	};
	const handleDeleteButton = file => {
		const filename = file['original']['System Type'] + '_' +
										 file['original']['Module Type'] + '_' +
										 file['original']['System Serial#'] + '_' +
										 file['original']['Module Serial#'];
		//console.log('fileName: ' + filename);
		const deleteConfirmation = window.confirm("Are you sure your want to delete this file? \n Press OK to delete or cancel to not delete.")
		if(deleteConfirmation){
			fetch('/deleteFile?fileName='+filename).then(data => {
				//console.log('delete response: ' + data);
				
					fetch('/getListOfPartsLists')
					.then((res) => res.json())
					.then((data) => {
						localStorage.setItem('retrievedFiles', data['ListOfPartsLists']);
						data['ListOfPartsLists'].forEach(file => console.log(file));
						//if(list.length === 1)setList([]);
						//else setList([0]);
						window.location.reload(false);  //refresh the page
				}).catch(error =>{
					//console.log('could not get a list of files.')
				});
				
			});
		}

	};
	return (
		<div>
			<table {...getTableProps()}>
				<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render('Header')}
										<span>
											{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
										</span>
										<div>{column.canFilter ? column.render('Filter') : null}</div>
									</th>
								))}
							</tr>
						))}
						</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map(row => { 
						prepareRow(row)
						return (
							<tr onDoubleClick={ e => {handleDoubleClick(row)}} {...row.getRowProps()}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
								<td><button onClick={e => handleDeleteButton(row)}>Delete File</button></td>
							</tr>
						)
					})}
					</tbody>
			</table>
	</div>
	);
}
export default SavedFile;