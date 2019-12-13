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

    this.myListBox = React.createRef();
    this.onSelect = this.onSelect.bind(this);
    this.onUnselect = this.onUnselect.bind(this);

    this.makeRequest = this.makeRequest.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  onSelect(event) {
    const item = this.myListBox.current.getItem(event.args.index);
    var element = item.originalItem;
    const type = element.type;

    /// add new item to the previous state based on the new selection
    console.log(this.state);
    this.setState(prevState => ({
      ...prevState,
      selected: {
        ...prevState.selected,
        [type]: element.label
      }
    }));

    // update the state.selected to reflect the new selected items
  }
  onUnselect(event) {
    const item = this.myListBox.current.getItem(event.args.index);
    var element = item.originalItem;
    const type = element.type;

    console.log("onUNselect", item);

    // update the state.selected to reflect the new selected items
  }

  makeRequest(event, type) {
    var url = new URL("http://192.168.0.200:5000/api/");
    var params = {};
    url.pathname += type;

    if (event !== "undefined") {
      console.log(this.state);
      this.setState(prevState => ({
        ...prevState,
        selected: {
          ...prevState.selected
        }
      }));
    }
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
    // .then function chaining
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
  }

  componentDidMount() {
    this.makeRequest("undefined", "groups");
  }

  render() {
    return (
      <div>
        <JqxListBox
          ref={this.myListBox}
          source={this.state.items.groups}
          multipleextended={false}
          onChange={e => this.makeRequest(e, "dataset")}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />
        <JqxListBox
          // ref={this.myListBox}
          source={this.state.items.dataset}
          multipleextended={false}
          onChange={e => this.makeRequest(e, "meta")}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />
      </div>
    );
  }
}

export default Toprow;
