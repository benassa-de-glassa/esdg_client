import React, { Component } from "react";
import JqxListBox from "jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox";

class Toprow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selected: []
    };
    this.makeRequest = this.makeRequest.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  makeRequest(event, type) {
    var url = new URL("http://localhost:5000/api/");
    var params = {};
    url.pathname += type;

    if (event !== "undefined") {
      console.log(this.state)
      this.setState(prevState => ({
        ...prevState,
        selected: {
          ...prevState.selected,
        }
      }));
    }

    console.log(event);
    // let group = this.state.items.groups[event.args.index]["label"];
    // let dataset = this.state.items.groups[event.args.index]["label"];
    // create the correct request based on the type parameter
    switch (type) {
      case "groups":
        break;
      case "dataset":
        // params = { dataset: group };
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
      .then(res => {
        this.setState(prevState => ({
          ...prevState,
          items: {
            ...prevState.items,
            [type]: res[type]
          }
        }));
      });
    console.log(this.state);
  }

  componentDidMount() {
    this.makeRequest("undefined", "groups");
  }

  render() {
    return (
      <div>
        <JqxListBox
          source={this.state.items.groups}
          multipleextended={false}
          onChange={e => this.makeRequest(e, "dataset")}
        />
        <JqxListBox
          source={this.state.items.dataset}
          multipleextended={false}
          onChange={e => this.makeRequest(e, "meta")}
        />
      </div>
    );
  }
}

export default Toprow;
