import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Scan from './containers/Scan';
import Home from './containers/Home';
import { Router, Switch, Route } from 'react-router-dom';
import history from './utils/history';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { en, fr } from 'make-plural/plurals';
import { messages as catalogEn } from './locale/en/messages';
import { messages as catalogFr } from './locale/fr/messages';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  overrides: {
    MuiSnackbarContent: {
      root: {
        color: 'white',
        backgroundColor: 'black',
      },
    },
  },
});

i18n.loadLocaleData('en', { plurals: en });
i18n.loadLocaleData('fr', { plurals: fr });
i18n.load('en', catalogEn);
i18n.load('fr', catalogFr);
i18n.activate(window.navigator.language.substring(0, 2) || 'en');

const App: React.FC = () => {
  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <Switch>
            <Route path="/scan">
              <Scan />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </I18nProvider>
  );
};

export default App;
