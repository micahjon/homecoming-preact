// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import '../node_modules/purecss/build/tables.css'; // Pure table styles CSS
import './style'; // index.less
import './style/gutenberg.css'; // Gutenberg print styles
import './style/formbase.css'; // Form styles

let root;
function init() {
	let App = require('./components/app').default;
	root = render(<App />, document.body, root);
}

// Disabled Service Worker b/c it wasn't working when I put built app in subdirectory
// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV==='production') {
	require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('./components/app', () => requestAnimationFrame(init) );
}

init();
