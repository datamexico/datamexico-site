import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";
import {Builder} from "@datawheel/canon-cms";

import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Loading from "./components/Loading";
import Explore from "./components/Explore";

/** */
export default function RouteCreate() {
  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route path="/:lang" component={Home} />
      <Route path="/:lang/admin" component={Builder} />
      <Route path="/:lang/explore" component={Explore} />
      <Route path="/loading" component={Loading} />
      <Route exact path="/:lang/profile/:slug/:id" component={Profile} />
    </Route>
  );
}
