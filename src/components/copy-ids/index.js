import { h, Component } from 'preact';
import style from './style.less';
import Clipboard from 'clipboard';

export default class CopyIds extends Component {

	componentDidMount() {
		this.clipboard = new Clipboard(this.button);
	}
	componentWillUnmount() {
		if (this.clipboard) this.clipboard.destroy();
	}

	render({ registrations, rows=10, cols=50 }) {

		const textareaId = 'copy-to-clipboard--' + ((Math.random() * 100000001) | 0);

		return (
			<div class={style.copyIds}>
				<textarea id={textareaId} rows={rows} cols={cols} class={style.copyIds__textarea}>
					{registrations
						.reduce((ids, { id, spouseid }) => {
							if (id) ids.push(id);
							if (spouseid) ids.push(spouseid);
							return ids;
						}, [])
						.sort()
						.join(', ')}
				</textarea>
				<button
					class={`${style.copyIds__button} pure-button pure-button-primary`}
					data-clipboard-target={`#${textareaId}`}
					type="button"
					ref={button => this.button = button}
				>
					Copy to Clipboard
				</button>
			</div>
		);
	}
}
