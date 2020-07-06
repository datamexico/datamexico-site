import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";
import {Builder} from "@datawheel/canon-cms";
import {Login, SignUp} from "@datawheel/canon-core";

import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import Loading from "./components/Loading";
import Explore from "./pages/Explore/Explore";
import About from "./pages/About/About";
import Data from "./pages/Data/Data";
import Error from "./pages/Error/Error";
import ECIExplorer from "./pages/ECIExplorer/ECIExplorer";
import Covid from "./pages/Covid/Covid";

/** */
export default function RouteCreate() {
  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route path="/:lang" component={Home} />
      <Route exact path="/cms/admin" component={Builder} />
      <Route path="/:lang/explore" component={Explore} />
      <Route path="/loading" component={Loading} />
      <Route exact path="/:lang/login" component={Login} />
      <Route exact path="/:lang/signup" component={SignUp} />
      <Route exact path="/:lang/eci/explore" component={ECIExplorer} />
      <Route exact path="/:lang/profile/:slug/:id" component={Profile} />
      {/* stubs */}
      <Route path="/:lang/about(/:page)" component={About} />
      <Route path="/:lang/data" component={Data} />
      <Route path="/:lang/covid" component={Covid} />
      {/* 404 */}
      <Route path="/:lang/*" component={Error} />
    </Route>
  );
}
