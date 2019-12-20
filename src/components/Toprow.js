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

    this.onSelect = this.onSelect.bind(this);
    this.onUnselect = this.onUnselect.bind(this);

    this.makeRequest = this.makeRequest.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  onSelect(event) {
    const element = event.args.item.originalItem;
    const type = element.type;
    var prevState = this.state;

    /// add new item to the previous state based on the new selection
    if (this.state.selected[type] !== undefined) {
      prevState.selected[type].push(element.label)
    } else {
      prevState.selected[type] = [element.label]
    }

    // update the state.selected to reflect the new selected items
    this.setState(previousState => ({
      ...previousState,
      selected: prevState.selected
    }));
  }
  onUnselect(event) {
    const item = event.args.item;
    if (item !== null) {

      var element = item.originalItem;
      const type = element.type;
      var prevState = this.state;


      /// add new item to the previous state based on the new selection
      if (this.state.selected[type] !== undefined) {
        // find find correct list_index to remove
        const list_index = prevState.selected[type].indexOf(element.label);
        // remove list_index from prevState
        prevState.selected[type].splice(list_index, 1)
      }
      else {
        // pass
      }

      // update the state.selected to reflect the new selected items
      this.setState(prevState => ({
        ...prevState,
        selected: prevState.selected
      }
      ));
    }
  }

  makeRequest(event, type) {
    var url = new URL("http://localhost:5000/api/");
    var params = {};
    url.pathname += type;

    // let group = this.state.items.groups[event.args.index]["label"];
    // let dataset = this.state.items.groups[event.args.index]["label"];
    // create the correct request based on the type parameter
    switch (type) {
      case "groups":
        break;
      case "dataset":
        params = { 
          dataset: this.state.selected["groups"]
        };
        break;
      case "meta":
        params = {
          groups: this.state.selected["groups"],
          dataset: this.state.selected["dataset"],
        };
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
          source={this.state.items.groups}
          multipleextended={false}
          onChange={e => this.makeRequest(e, "dataset")}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />
        <JqxListBox
          source={this.state.items.dataset}
          multipleextended={false}
          onChange={e => this.makeRequest(e, "meta")}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />

      {/* {
        // create listboxes dynamically depending on the elements in this.state.items.meta
        this.state.items.meta.map( element => jqxlistbox of elemet)
      } */}

      </div>
    );
  }
}

export default Toprow;
