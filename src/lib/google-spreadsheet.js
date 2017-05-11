/**
 * Fetch Google Spreadsheet data via JSONP
 * @param  {String} id 		Id of Google Spreadsheet
 * @param  {String} query  	Query function (optional) (see https://developers.google.com/chart/interactive/docs/querylanguage)
 * @return {Response}        
 *
 * Inspired by this Gist: https://gist.github.com/gf3/132080 
 */
const fetchSpreadsheet = (unique => (id, query) =>
	new Promise(rs => {
		const script = document.createElement('script');
		const name = `_jsonp_${unique++}`;

		let url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=responseHandler:${name}`;

		if (typeof query === 'string' && query.length) {
			url += `&tq=${query}`;
		}

		script.src = url;
		window[name] = json => {
			rs(new Response(JSON.stringify(json)));
			script.remove();
			delete window[name];
		};

		document.body.appendChild(script);
	}))(0);

const getRowObjects = (id, query) => {
	return fetchSpreadsheet(id)
		.then(function(response) {
			return response.json();
		})
		// Transform rows & columns into objects { col_name: "row value", ... }
		.then(function(json) {
			const { cols } = json.table;
			const rows = json.table.rows.map(row => row.c);
			let objects = [];

			rows.forEach((row, rowIndex) => {
				let obj = {};
				row.forEach((value, colIndex) => {
					if (value && value.v) {
						obj[ cols[colIndex].label ] = value.v;
					}
				})
				objects.push(obj);
			})

			return { columns: cols, rows: rows, rowObjects: objects };
		})
		.catch(function(err) {
			alert(
				'Sorry, an error occurred while trying to fetch Google Spreadsheet\n' +
					err
			);
			console.error('Unable to get spreadsheet data', err);
		});
};

module.exports = {
	fetch: fetchSpreadsheet,
	getRowObjects: getRowObjects,
};
