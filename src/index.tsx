import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import bugsnagClient from './utils/bugsnagClient';
import { I18nProvider } from '@lingui/react';
import { setupI18n } from '@lingui/core';
import catalogEn from './locales/en.json';
import catalogFr from './locales/fr.json';

const ErrorBoundary = bugsnagClient.getPlugin('react');
const i18n = setupI18n();
i18n.load('en', catalogEn);
i18n.load('fr', catalogFr);
i18n.activate(window.navigator.language.substring(0, 2) || 'en');

ReactDOM.render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider i18n={i18n}>
        <App />
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
