import { h, Component } from 'preact';
import style from './style.less';

export default class Individuals extends Component {
	state = {
		selectedType: 'All',
	};

	// gets called when this route is navigated to
	componentDidMount() {}

	// gets called just before navigating away from the route
	componentWillUnmount() {}

	render({ registrations, events }, { selectedType }) {
		return (
			<div class={style.individuals}>
				<h1>Individuals</h1>
				<form class={`${style.individuals__form} pure-form`}>
					<label for="show-all" class="pure-radio">
						<input
							id="show-all"
							type="radio"
							name="toggleType"
							onChange={() => this.setState({ selectedType: 'All' })}
						/>
						All (default)
					</label>
					<label for="show-alumni" class="pure-radio">
						<input
							id="show-alumni"
							type="radio"
							name="toggleType"
							onChange={() => this.setState({ selectedType: 'Alumni' })}
						/>
						Alumni
					</label>
					<label for="show-grandparents" class="pure-radio">
						<input
							id="show-grandparents"
							type="radio"
							name="toggleType"
							onChange={() => this.setState({ selectedType: 'Grandparent' })}
						/>
						Grandparents
					</label>
					<label for="show-parents" class="pure-radio">
						<input
							id="show-parents"
							type="radio"
							name="toggleType"
							onChange={() => this.setState({ selectedType: 'Parent' })}
						/>
						Parents
					</label>
				</form>

				{registrations
					.filter(reg => selectedType === 'All' || reg.type === selectedType)
					.map(reg => {
						const name = `${reg.firstname} ${reg.lastname}`;
						const spouse = reg.spouselastname
							? `Spouse: ${reg.spousefirstname} ${reg.spouselastname}`
							: ``;
						return (
							<section class="page-break-before">
								<h2>{name}</h2>
								<p>{spouse}</p>
								<table
									class={`${style.individuals__table} pure-table pure-table-horizontal pure-table-striped`}
								>
									<tr>
										<td>
											<svg
												viewBox="0 0 32 32"
												class={style.individuals__icon}
											>
												<title>email</title>
												<path d="M26.667 0h-21.333c-2.934 0-5.334 2.4-5.334 5.334v21.332c0 2.936 2.4 5.334 5.334 5.334h21.333c2.934 0 5.333-2.398 5.333-5.334v-21.332c0-2.934-2.399-5.334-5.333-5.334zM26.667 4c0.25 0 0.486 0.073 0.688 0.198l-11.355 9.388-11.355-9.387c0.202-0.125 0.439-0.198 0.689-0.198h21.333zM5.334 28c-0.060 0-0.119-0.005-0.178-0.013l7.051-9.78-0.914-0.914-7.293 7.293v-19.098l12 14.512 12-14.512v19.098l-7.293-7.293-0.914 0.914 7.051 9.78c-0.058 0.008-0.117 0.013-0.177 0.013h-21.333z" />
											</svg>{reg.email}
										</td>
										<td>
											<svg
												viewBox="0 0 32 32"
												class={style.individuals__icon}
											>
												<title>phone</title>
												<path d="M22 20c-2 2-2 4-4 4s-4-2-6-4-4-4-4-6 2-2 4-4-4-8-6-8-6 6-6 6c0 4 4.109 12.109 8 16s12 8 16 8c0 0 6-4 6-6s-6-8-8-6z" />
											</svg>{reg.phone.trim()}
										</td>
										<td>
											<svg
												viewBox="0 0 20 28"
												class={style.individuals__icon}
											>
												<title>id number</title>
												<path d="M16 19.656c0 1.344-0.891 2.344-2 2.344h-8c-1.109 0-2-1-2-2.344 0-2.438 0.609-5.141 3.062-5.141 0.766 0.719 1.797 1.172 2.938 1.172s2.172-0.453 2.938-1.172c2.453 0 3.062 2.703 3.062 5.141zM13.594 11.547c0 1.969-1.609 3.547-3.594 3.547s-3.594-1.578-3.594-3.547c0-1.953 1.609-3.547 3.594-3.547s3.594 1.594 3.594 3.547zM18 25.5v-21.5h-16v21.5c0 0.266 0.234 0.5 0.5 0.5h15c0.266 0 0.5-0.234 0.5-0.5zM20 2.5v23c0 1.375-1.125 2.5-2.5 2.5h-15c-1.375 0-2.5-1.125-2.5-2.5v-23c0-1.375 1.125-2.5 2.5-2.5h5.5v1.5c0 0.281 0.219 0.5 0.5 0.5h3c0.281 0 0.5-0.219 0.5-0.5v-1.5h5.5c1.375 0 2.5 1.125 2.5 2.5z" />
											</svg>{reg.id || '(none)'}
										</td>
									</tr>
								</table>
								<table
									class={`${style.individuals__table} pure-table pure-table-horizontal pure-table-striped`}
								>
									<thead>
										<th>Event</th>
										<th>Qty</th>
										<th>Cost</th>
										<th>Subtotal</th>
										<th>Day</th>
									</thead>
									{events
										.filter(event => {
											return reg[event.slug];
										})
										.map(event => {
											return (
												<tr>
													<td>{event.name}</td>
													<td>{reg[event.slug]}</td>
													<td>
														{event.cost ? `$${event.cost}` : ` - `}
													</td>
													<td>
														{event.cost
															? `$${reg[event.slug] * event.cost}`
															: `$0`}
													</td>
													<td>{event.day}</td>
												</tr>
											);
										})}
									<tr>
										<td colspan="2" /><td /><td>
											{(!reg.total && <span>$0</span>) ||
												((reg.paymentmethod.indexOf('Credit') === 0 ||
													reg.total <= reg.amountpaid) &&
													<span>${reg.total} paid in full</span>) ||
												<strong>
													${reg.total - (reg.amountpaid || 0)} due
												</strong>}
										</td><td />
									</tr>
								</table>
							</section>
						);
					})}

			</div>
		);
	}
}
