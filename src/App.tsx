import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Scan from './containers/Scan';
import Home from './containers/Home';
import { Router, Switch, Route } from 'react-router-dom';
import history from './utils/history';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  return (
    <div>
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
    </div>
  );
};

export default App;
