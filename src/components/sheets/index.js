import { h, Component } from 'preact';
import style from './style.less';
import googleSpreadsheet from '../../lib/google-spreadsheet';

/**
 * This class takes care of fetching the data from Google Spreadsheets
 * It then updates the model in app.js, which propagates down into all
 * other views.
 */
export default class Sheets extends Component {
	/**
	 * Pass initialProps directly from app.js, where a new instance of Sheets 
	 * is created. Why? This allows me to fetch the model the first time, w/out
	 * navigating to the /sheets/ route to initialize this component.
	 */
	constructor(initialProps) {
		super();

		this.props = initialProps;

		this.state = {
			// Spreadsheet-related data
			sheets: {
				registrations: {
					ready: false,
					status: '',
					spreadsheetId: null,
					worksheetId: null,
					spreadsheetUrl: localStorage.getItem(
						'spreadsheet-registrations'
					),
				},
				events: {
					ready: false,
					status: '',
					spreadsheetId: null,
					worksheetId: null,
					spreadsheetUrl: localStorage.getItem('spreadsheet-events'),
				},
			},
		};

		// Parse urls
		this.parseUrl(this.state.sheets.events.spreadsheetUrl, 'events');
		this.parseUrl(
			this.state.sheets.registrations.spreadsheetUrl,
			'registrations'
		);
	}

	/**
	 * Get Google Spreadsheet id and worksheet id from url and update model
	 */
	parseUrl = (url, sheetName) => {
		url = typeof url === 'string' ? url : '';

		const spreadsheetId = googleSpreadsheet.getSpreadsheetIdFromUrl(url);
		const worksheetId = googleSpreadsheet.getWorksheetIdFromUrl(url);
		const ready = !!(spreadsheetId && worksheetId);

		let status = '';
		if (!url) {
			status = `Please enter a Google Spreadsheet url`;
		} else if (!spreadsheetId) {
			status = `Sorry, unable to find spreadsheet id in the provided url`;
		} else if (!worksheetId) {
			status = `Sorry, unable to find worksheet id in the provided url`;
		} else {
			status = `Success! Spreadsheet url is valid`;
		}

		// Update state
		this.updateSheet(sheetName, {
			ready: ready,
			status: status,
			spreadsheetId: spreadsheetId,
			worksheetId: worksheetId,
			spreadsheetUrl: url,
		});

		// Save urls in LocalStorage
		localStorage.setItem('spreadsheet-' + sheetName, url);

		// Re-fetch model
		this.checkForUpdates();
	};

	/**
	 * Update properties on sheet
	 */
	updateSheet = (sheetName, sheetData) => {
		let newSheetsState = Object.assign({}, this.state.sheets);
		newSheetsState[sheetName] = Object.assign(
			newSheetsState[sheetName],
			sheetData
		);
		this.setState({
			sheets: newSheetsState,
		});
	};

	/**
	 * Check Google Spreadsheet for changes and update the model accordingly
	 */
	checkForUpdates = () => {
		const eventsSheet = this.state.sheets.events;
		const registrationsSheet = this.state.sheets.registrations;

		if (!eventsSheet.ready || !registrationsSheet.ready) return;

		if (
			eventsSheet.spreadsheetId === registrationsSheet.spreadsheetId &&
			eventsSheet.worksheetId === registrationsSheet.worksheetId
		) {
			this.updateSheet('events', {
				ready: false,
				status: 'Spreadsheet urls must be different',
			});
			console.log('Update aborted: spreadsheet urls must be different');
			return;
		}

		console.log('Update started');

		Promise.all([
			googleSpreadsheet.getRowObjects(
				registrationsSheet.spreadsheetId,
				registrationsSheet.worksheetId
			),
			googleSpreadsheet.getRowObjects(
				eventsSheet.spreadsheetId,
				eventsSheet.worksheetId
			),
		])
			.then(([registrationData, eventData]) => {
				const registrations = registrationData.rowObjects
					? registrationData.rowObjects
					: [];
				let events = eventData.rowObjects ? eventData.rowObjects : [];

				if (registrations.length) {
					this.updateSheet('registrations', {
						ready: true,
						status: `Success! Got ${registrations.length} registrations`,
					});
				} else {
					this.updateSheet('registrations', {
						ready: false,
						status: registrationData.error,
					});
				}

				if (events.length) {
					this.updateSheet('events', {
						ready: true,
						status: `Success! Got ${events.length} events`,
					});
				} else {
					this.updateSheet('events', {
						ready: false,
						status: eventData.error,
					});
				}

				// Add slug to event objects (e.g. {Name = 'Event A', slug = 'eventa'})
				// which matches property on registration objects (e.g. { eventa: 2 })
				events = events.map(event => 
					Object.assign(event, {
						slug: event.name.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '')
					})
				);

				// console.log('events, registrations', events ,registrations);

				// Update the app's model with the new data
				this.props.updateAppModel({
					registrations: registrations,
					events: events,
					sheetsReady: !!(registrations.length && events.length),
				});
			})
			.catch(err => {
				console.log(
					'An error occurred while fetching spreadsheet data',
					err
				);
			});
	};

	// gets called when this route is navigated to
	componentDidMount() {
		// Allow App to trigger updates
		this.props.allowAppToTriggerUpdates(this.checkForUpdates);
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {}

	// Note: `user` comes from the URL, courtesy of our router
	render({}, state) {
		const sheets = state.sheets;

		return (
			<div class={style.sheets}>
				<h1>Google Spreadsheets</h1>
				<p>
					This app depends on data from 2 worksheets in a Google Spreadsheet. Open these sheets in your browser and copy the urls into the fields below:
				</p>
				<div>
					<h2>Registrations</h2>
					<p class={style.sheets__status} style={`color: ${ !sheets.registrations.spreadsheetUrl ? 'black' : (sheets.registrations.ready ? 'green' : 'red')}`}>
						{sheets.registrations.status}
					</p>
					<form
						onSubmit={e => {
							e.preventDefault();
							this.parseUrl(
								e.target.firstElementChild.value,
								'registrations'
							);
						}}
					>
						<input
							class={style.sheets__input + ' input'}
							type="url"
							placeholder="Worksheet Url"
							value={sheets.registrations.spreadsheetUrl}
						/>
						<button class={style.sheets__button} type="submit">
							Save
						</button>
					</form>
				</div>
				<div>
					<h2>Events</h2>
					<p class={style.sheets__status} style={`color: ${ !sheets.events.spreadsheetUrl ? 'black' : (sheets.events.ready ? 'green' : 'red')}`}>{sheets.events.status}</p>
					<form
						onSubmit={e => {
							e.preventDefault();
							this.parseUrl(
								e.target.firstElementChild.value,
								'events'
							);
						}}
					>
						<input
							class={style.sheets__input + ' input'}
							type="url"
							placeholder="Worksheet Url"
							value={sheets.events.spreadsheetUrl}
						/>
						<button class={style.sheets__button} type="submit">
							Save
						</button>
					</form>
				</div>
				<br />
				<br />
				<hr />
				<small>
					<em>
						The Google Sheets icon is used courtesy of <a
							href="https://icons8.com/web-app/30461/Google-Sheets"
							target="_blank"
						>
							Icons8
						</a>
					</em>
				</small>
			</div>
		);
	}
}
