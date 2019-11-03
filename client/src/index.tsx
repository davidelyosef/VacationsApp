import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Layout } from './components/layout/layout';

ReactDOM.render(<Layout />, document.getElementById('root'));

serviceWorker.unregister();
