import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto/latin.css';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import bugsnagClient from './utils/bugsnagClient';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { en, fr } from 'make-plural/plurals';
import catalogEn from './locales/en.json';
import catalogFr from './locales/fr.json';

const ErrorBoundary = bugsnagClient
  .getPlugin('react')!
  .createErrorBoundary(React);

i18n.loadLocaleData('en', { plurals: en });
i18n.loadLocaleData('fr', { plurals: fr });
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
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
