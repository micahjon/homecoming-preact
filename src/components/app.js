import { h, Component } from 'preact';
import { route, Router } from 'preact-router';

import Header from './header';
import Home from './home';
import Profile from './profile';
import Events from './events';
import Individuals from './individuals';

import googleSpreadsheet from '../lib/google-spreadsheet';

export default class App extends Component {
	constructor() {
		super();
		this.localStorageKey = 'google-spreadsheet-id';
		this.state = {
			spreadsheetId: '',
			// Ids needed to fetch data from worksheets in Google Spreadsheets
			sheets: {
				ready: false,
				events: {
					spreadsheetId: null,
					worksheetId: null,
				},
				registrations: {
					spreadsheetId: null,
					worksheetId: null,
				}
			},
			// List of all event objects
			events: [],
			// List of all registrations
			registrations: [],
		};
	}

	/**
	 * Get spreadsheet credentials from LocalStorage
	 */

	/**
	 * Get Google Spreadsheet id from user-provided url and store it in LocalStorage
	 */
	getSpreadsheetId = () => {
		if (Router.getCurrentUrl() !== '/sheets/') {
			const success = route('/events/');
			console.log(
				success
					? 'Routed user to /events/'
					: 'Failed to route user to /events/'
			);
		}

		// Prompt user for url (and get id from url)
		// const url =
		// 	prompt(
		// 		'Please enter the url of the Homecoming Google Spreadsheet'
		// 	) || '';
		// const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)\//);
		// if (matches && matches[1]) {
		// 	// Save in LocalStorage
		// 	localStorage.setItem(this.localStorageKey, matches[1]);
		// 	return matches[1];
		// }
		// console.log(
		// 	'Unable to get Google Spreadsheet id from user input:',
		// 	url
		// );
	};

	/**
	 * Check Google Spreadsheet for changes and update the model accordingly
	 */
	checkForUpdates = () => {
		const id = this.state.spreadsheetId;

		if (!id) return;

		// use the ?gid parameter to specify the worksheet
		// https://docs.google.com/spreadsheets/d/..../gviz/tq?gid=152900811&tqx=responseHandler:_jsonp_1


		googleSpreadsheet.getRowObjects(id).then(({ columns, rowObjects }) => {
			// Event columns are identified in the spreadsheet by having "(event)"
			// in their name. Add them to a separate list, so we can easily loop over them
			// down the road
			let events = columns
				.filter(({ label }) => {
					return label.indexOf('(event)') !== -1;
				})
				.map(({ label }) => {
					return label;
				});

			// Remove the "(event)" designation from both the registartion object keys and the
			// event name list
			const registrations = rowObjects.map(registrant => {
				events.forEach(eventName => {
					if (eventName in registrant) {
						registrant[fixEventName(eventName)] =
							registrant[eventName];
						delete registrant[eventName];
					}
				});
				return registrant;
			});

			events = events.map(eventName => {
				return fixEventName(eventName);
			});

			function fixEventName(label) {
				return label.replace('(event)', '').trim();
			}

			this.setState({
				events: events,
				registrations: registrations,
			});

			console.log('Updated model from Google Spreadsheet');
		});
	};

	/**
	 * Refresh model every time this tab gains focus
	 */
	handleVisibilityChange = () => {
		// Refresh model
		if (!document.hidden) this.checkForUpdates();
	};

	componentDidMount() {
		// On tab focus, refresh the model
		document.addEventListener(
			'visibilitychange',
			this.handleVisibilityChange,
			false
		);
		// On first boot, populate the model
		const spreadsheetId =
			localStorage.getItem(this.localStorageKey) ||
			this.getSpreadsheetId();
		this.checkForUpdates();
	}

	componentWillUnmount() {
		// Stop listening to tab focus
		document.removeEventListener(
			'visibilitychange',
			this.handleVisibilityChange
		);
	}

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render(props, state) {
		return (
			<div id="app">
				<Header sheetsReady={state.sheets.ready} />
				<Router onChange={this.handleRoute}>
					<Home
						path="/"
						getSpreadsheetId={this.getSpreadsheetId}
						registrations={state.registrations}
						events={state.events}
					/>
					<Events
						path="/events/"
						registrations={state.registrations}
						events={state.events}
					/>
					<Individuals
						path="/individuals/"
						registrations={state.registrations}
						events={state.events}
					/>
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
				</Router>
				<a href="https://icons8.com/web-app/30461/Google-Sheets">
					Google sheets icon credits
				</a>
			</div>
		);
	}
}
