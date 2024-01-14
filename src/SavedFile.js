import { formData } from "./formData";

function SavedFile(){
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
		<table>
			<thead>
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
		</table>
	</div>
	);
}
export default SavedFile;