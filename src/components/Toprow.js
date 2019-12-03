import React, { Component } from "react";
import { ListBox } from "primereact/listbox";

class Toprow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  makeRequest(event, type) {
    var url = new URL("http://localhost:5000/api/");
    var params = {};
    url.pathname += type;

    // create the correct request based on the type parameter
    switch (type) {
      case "groups":
        break;
      case "dataset":
        break;
      case "meta":
        break;
      default:
        console.log("default");
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );

    console.log(url);
    // fetch the url
    // then function chaining
    fetch(url)
    .then(res => res.json())
    .then(res => console.log(res))
    .then(res => this.setState(res))

    console.log(this.state)
  }
  componentDidMount() {
    this.makeRequest("undefined", "groups");
  }

  render() {
    return <ListBox options={this.state.options} />;
    // return <div> textInComponent </div>;
  }
}

export default Toprow;
