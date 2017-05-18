import { h, Component } from 'preact';
import style from './style.less';
import Events from '../events';

export default class Home extends Component {
	render(props, state) {
		return (
			<div class={style.home}>
				<h1>About</h1>
				<p>Homecoming Reports web application, built by Micah Miller-Eshleman (May '07)</p>
				<p>Uses data from 2 Google Spreadsheet worksheets to generate reports on homecoming registrations and events</p>
			</div>
		);
	}
}
