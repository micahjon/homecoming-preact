import { h, Component } from 'preact';
import style from './style.less';
import googleSpreadsheet from '../../lib/google-spreadsheet';
import Events from '../events';

export default class Home extends Component {
	constructor() {
		super();
		this.localStorageKey = 'google-spreadsheet-id';
		this.state = {
			time: Math.random(),
			spreadsheetId: localStorage.getItem(this.localStorageKey) ||
				this.getSpreadsheetId(),
		};
		this.checkForUpdates();
	}

	/**
	 * Get Google Spreadsheet id from user-provided url and store it in LocalStorage
	 */
	getSpreadsheetId() {
		// Prompt user for url (and get id from url)
		const url =
			prompt(
				'Please enter the url of the Homecoming Google Spreadsheet'
			) || '';
		const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)\//);
		if (matches && matches[1]) {
			// Save in LocalStorage
			localStorage.setItem(this.localStorageKey, matches[1]);
			return matches[1];
		}
		console.log(
			'Unable to get Google Spreadsheet id from user input:',
			url
		);
	};

	/**
	 * Check Google Spreadsheet for changes and update the model accordingly
	 */
	checkForUpdates = () => {
		const id = this.state.spreadsheetId;

		if (!id) return;

		googleSpreadsheet.getRowObjects(id).then(({columns, rowObjects}) => {
			// Event columns are identified in the spreadsheet by having "(event)"
			// in their name. Add them to a separate list, so we can easily loop over them 
			// down the road
			let events = columns
				.filter(({label}) => { return label.indexOf('(event)') !== -1 })
				.map(({label}) => { return label; });

			// Remove the "(event)" designation from both the registartion object keys and the 
			// event name list
			const registrations = rowObjects.map((registrant) => {
				events.forEach((eventName) => {
					if ( eventName in registrant ) {
						registrant[fixEventName(eventName)] = registrant[eventName];
						delete registrant[eventName];
					}
				})
				return registrant;
			});

			events = events.map(eventName => { return fixEventName(eventName) });

			function fixEventName(label) { return label.replace('(event)', '').trim(); }

			this.setState({
				events: events,
				registrations: registrations,
			});
			// console.log('Updated model', registrations, events);
		});
	};

	componentDidMount() {
		// Update model every minute by fetching Google Spreadsheet
		this.timer = setInterval(this.checkForUpdates, 60 * 1000);
	}

	componentWillUnmount() {
		// stop when not renderable
		clearInterval(this.timer);
	}

	render(props, state) {
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
				<button onClick={() => this.getSpreadsheetId()}>
					Change Spreadsheet
				</button>
				<p>Spreadsheet Id: <small>{state.spreadsheetId}</small></p>
				<p>state: {state.time}</p>
				<Events registrations={state.registrations} events={state.events} />
			</div>
		);
	}
}
