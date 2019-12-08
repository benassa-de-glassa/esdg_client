import React, { Component } from "react";
import JqxListBox from'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox';

class Toprow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selected: []
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
      .then(res => {
        this.setState({
          isLoaded: true,
          items: res
        });
      });
  }
  componentDidMount() {
    this.makeRequest("undefined", "groups");
  }

  render() {
    return (
      <div>
        <JqxListBox
          source={this.state.items.groups}
          multipleextended={true}
          onChange={e => console.log(e)}
        />
      </div>
    );
  }
}

export default Toprow;
