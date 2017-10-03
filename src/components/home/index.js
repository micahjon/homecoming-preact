import { h, Component } from 'preact';
import style from './style.less';
import Events from '../events';
import CopyIds from '../copy-ids';

export default class Home extends Component {
	render({registrations}) {
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>Homecoming Reports web application, built by Micah Miller-Eshleman (May '07)</p>
				<p>
					Uses data from 2 Google Spreadsheet worksheets to generate reports on homecoming
					registrations and events
				</p>

				<h2>All Ids</h2>
				<CopyIds registrations={registrations} />
			</div>
		);
	}
}
