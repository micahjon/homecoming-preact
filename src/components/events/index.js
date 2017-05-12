import { h, Component } from 'preact';
import style from './style.less';

export default class Events extends Component {
	state = {
		selectedEvent: null,
		attendance: {}, // count of registrants by event
	};

	// gets called when this route is navigated to
	componentDidMount() {}

	// gets called just before navigating away from the route
	componentWillUnmount() {}

	// Count how many registrations there are for each event
	getAttendance = (registrations, events) => {
		let countByEvent = {};

		events.forEach(event => {
			countByEvent[event] = registrations.reduce((acc, obj) => {
				if (obj[event]) acc += obj[event];
				return acc;
			}, 0);
		});

		this.setState({
			attendance: countByEvent
		});
	};

	render({ registrations, events }, { selectedEvent, attendance }) {
		
		if (registrations && events) this.getAttendance(registrations, events);

		return (
			<div class={style.events}>
				<h1>Events</h1>
				<p>Selected Event: {selectedEvent}</p>
				<p>All Events: </p>
				<ul>{events.map(event => { return <li>{event} - {attendance[event]}</li> })}</ul>
				{events.map(event => {
					return (
						<div>
							<h2 class="page-break-before">{event} ({attendance[event]})</h2>
							<table class={style.events__table}>
								<tr>
									<th>Alum</th>
									<th>Spouse</th>
									<th>ID</th>
									<th>Qty</th>
									<th>Dietary Restriction</th>
								</tr>
								{registrations
									.filter(reg => {
										return reg[event];
									})
									.map(reg => {
										const name = reg['Last Name'] + ', ' + reg['First Name'];
										const spouseName = reg['Spouse Last Name'] ? reg['Spouse Last Name'] + ', ' + reg['Spouse First Name'] : '';
										return (
											<tr>
												<td>{name}</td>
												<td>{spouseName}</td>
												<td>{reg['Id']}</td>
												<td>{reg[event]}</td>
												<td>{reg['Dietary Restrictions']}</td>
											</tr>
										);
									})}
							</table>
						</div>
					);
				})}

			</div>
		);
	}
}
