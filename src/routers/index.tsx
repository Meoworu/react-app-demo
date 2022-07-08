import { StrictMode } from 'react';
import { Router, Route, Switch } from 'dva/router';
import { RouterAPI, Router as RouterType } from 'dva';
import { User } from './User';
import { Home } from './Home';

export const router: RouterType = ({ history }: any) => (
  <StrictMode>
    <Router history={history}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/user" component={User} />
      </Switch>
    </Router>
  </StrictMode>
);
