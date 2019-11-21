import React, {Component} from "react";
import "./App.css";
import "helpers/d3plus.css";

export default class App extends Component {
  render() {
    return this.props.children;
  }
}
