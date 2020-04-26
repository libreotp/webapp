import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import bugsnagClient from './utils/bugsnagClient';

const ErrorBoundary = bugsnagClient.getPlugin('react');

ReactDOM.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
