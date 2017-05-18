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
						const name = `${reg.firstname} ${reg.lastname}`;
						const spouse = reg.spouselastname ? `Spouse: ${reg.spousefirstname} ${reg.spouselastname}` : ``;
						return (
							<section class="page-break-before">
								<h2>{name} ({reg.type})</h2>
								<p>{spouse}</p>
								<p>Id: {reg.id || '(none)'}</p>
								<p>Phone: {reg.phone}</p>
								<p>Email: {reg.email}</p>
								<table class={`${style.events__table} pure-table pure-table-horizontal pure-table-striped`} >
								<thead>
									<th>Event</th>
									<th>Qty</th>
									<th>Cost</th>
									<th>Subtotal</th>
									<th>Day</th>
								</thead>
								{ events
									.filter(event => {return reg[event.slug]})
									.map(event => {return (
										<tr>
											<td>{event.name}</td>
											<td>{reg[event.slug]}</td>
											<td>{event.cost ? `$${event.cost}` : ` - `}</td>
											<td>{event.cost ? `$${reg[event.slug] * event.cost}` : `$0`}</td>
											<td>{event.day}</td>
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
