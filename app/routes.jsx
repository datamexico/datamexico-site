import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";
import {Builder} from "@datawheel/canon-cms";

import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import {Profile as CMSProfile} from "@datawheel/canon-cms";

/** */
export default function RouteCreate() {
  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route path="/admin" component={Builder} />
      <Route exact path="/profile2/:pslug/:pid" component={Profile} />
      <Route exact path="/profile/:slug/:id" component={CMSProfile} />
    </Route>
  );
}
