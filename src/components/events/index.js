import { h, Component } from 'preact';
import style from './style.less';

export default class Events extends Component {
	state = {
		selectedEvent: null,
	};

	// gets called when this route is navigated to
	componentDidMount() {}

	// gets called just before navigating away from the route
	componentWillUnmount() {}

	// Count how many registrations there are for each event
	countRegistrants = (registrations, events) => {
		let countByEvent = {};

		events.forEach(event => {
			countByEvent[event] = registrations.reduce((acc, obj) => {
				if (obj[event]) acc += obj[event];
				return acc;
			}, 0);
		});

		return countByEvent;
	};

	render({ registrations, events }, { selectedEvent }) {
		// List of events and how many people have registered
		let eventsList = <p>Loading...</p>;

		if (registrations && events) {
			const counts = this.countRegistrants(
				registrations,
				events
			);
			eventsList = (
				<ul>
					{events.map(event => {
						return <li>{event} - {counts[event]}</li>;
					})}
				</ul>
			);
		}

		// How many people are registered for each event?
		// const eventRegistrationCount = this.countRegistrationsByEvent(registrations, events);

		return (
			<div class={style.events}>
				<hr />
				<h2>Events</h2>
				<p>Selected Event: {selectedEvent}</p>
				<p>All Events: </p>
				{eventsList}
			</div>
		);
	}
}
