import { h, Component } from 'preact';
import style from './style.less';
import Events from '../events';

export default class Home extends Component {
	render(props, state) {


		return (
			<div class={style.home}>
				<h1>Home</h1>
				<button onClick={() => props.getSpreadsheetId()}>Change Spreadsheet</button>
				<p>This is the Home component.</p>
			</div>
		);
	}
}
