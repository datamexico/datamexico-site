import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";
import {Builder} from "@datawheel/canon-cms";

import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

/** */
export default function RouteCreate() {
  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route path="/admin" component={Builder} />
      <Route exact path="/profile/:pslug/:pid" component={Profile} />
    </Route>
  );
}
