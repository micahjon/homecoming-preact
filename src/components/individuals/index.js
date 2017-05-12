import { h, Component } from 'preact';
import style from './style.less';

export default class Individuals extends Component {
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
			<div class={style.individuals}>
				<h1>Individuals</h1>
				{registrations
					.map(reg => {
						const name = `${reg['First Name']} ${reg['Last Name']}`;
						const spouse = reg['Spouse Last Name'] ? `Spouse: ${reg['Spouse First Name']} ${reg['Spouse Last Name']}` : ``;
						return (
							<section class="page-break-before">
								<h2>{name} ({reg['Type']})</h2>
								<p>{spouse}</p>
								<p>Id: {reg['Id'] || '(none)'}</p>
								<p>Phone: {reg['Phone']}</p>
								<p>Email: {reg['Email']}</p>
								<h3>Events</h3>
								<table class={style.events__table}>
								<tr>
									<th>Event</th>
									<th>Qty</th>
									<th>Cost</th>
									<th>Subtotal</th>
								</tr>
								{ events
									.filter(event => {return reg[event]})
									.map(event => {return (
										<tr>
											<td>{event}</td>
											<td>{reg[event]}</td>
											<td>{reg[event]}</td>
											<td>{reg['Dietary Restrictions']}</td>
										</tr>
										)})

								}
								</table>
							</section>
						);
					})}

			</div>
		);
	}
}
