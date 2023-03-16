import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { settings } from './Components/Authentication/auth0Settings';
import MuiThemeProvider from './Components/MuiThemeProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<MuiThemeProvider>
			<Auth0Provider domain={`${settings.domain}`} clientId={`${settings.clientID}`} redirectUri={window.location.origin}>
				<App />
			</Auth0Provider>
		</MuiThemeProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
