import { h, Component } from 'preact';
import { route, Router } from 'preact-router';
import { publicPath } from '../lib/public-path';

import Header from './header';
import Home from './home';
import Events from './events';
import Individuals from './individuals';
import Sheets from './sheets';


export default class App extends Component {
	state = {
		// Are the spreadsheets working?
		sheetsReady: false,
		// List of all event objects
		events: [],
		// List of all registrations
		registrations: [],
	};

	/**
	 * Refresh model every time this tab gains focus
	 */
	handleVisibilityChange = () => {
		// Refresh model
		if (!document.hidden && this.checkForUpdates) this.checkForUpdates();
	};

	componentDidMount() {
		// Go to /sheets/ route if the model isn't ready
		if (!this.state.events.length || !this.state.registrations.length) {
			if (Router.getCurrentUrl() !== publicPath + 'sheets/') {
				// Manually initialize /sheets/ component to fetch model the first time
				new Sheets({
					allowAppToTriggerUpdates: updateFunction => {
						this.checkForUpdates = updateFunction;
					},
					updateAppModel: model => this.setState(model),
				});
			}
		}

		// On tab focus, refresh the model
		document.addEventListener(
			'visibilitychange',
			this.handleVisibilityChange,
			false
		);
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
				<Header sheetsReady={state.sheetsReady} />
				<Router onChange={this.handleRoute}>
					<Home
						path={publicPath}
						getSpreadsheetId={this.getSpreadsheetId}
						registrations={state.registrations}
						events={state.events}
					/>
					<Events
						path={`${publicPath}events/`}
						registrations={state.registrations}
						events={state.events}
					/>
					<Individuals
						path={`${publicPath}individuals/`}
						registrations={state.registrations}
						events={state.events}
					/>
					<Sheets
						path={`${publicPath}sheets/`}
						updateAppModel={model => this.setState(model)}
						allowAppToTriggerUpdates={updateFunction => {
							this.checkForUpdates = updateFunction;
						}}
					/>
				</Router>
			</div>
		);
	}
}
