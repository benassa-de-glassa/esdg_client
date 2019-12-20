import React, { Component } from 'react'
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox'

import { API_URL } from '../paths.js'

class Toprow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selected: []
    }

    this.onSelect = this.onSelect.bind(this)
    this.onUnselect = this.onUnselect.bind(this)

    this.makeRequest = this.makeRequest.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  onSelect (event) {
    // console.log("select", event)

    const element = event.args.item.originalItem
    const type = element.type
    var prevState = this.state

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
    }))
    // console.log(this.state.selected.dataset)
  }

  onUnselect (event) {
    console.log('unselect', event)
    const item = event.args.item
    // console.log("item ", item)
    if (item !== null) {
      var element = item.originalItem
      const type = element.type
      var prevState = this.state
      console.log('this.state.selected[type] ', this.state.selected[type])

      /// add new item to the previous state based on the new selection
      if (this.state.selected[type] !== undefined) {
        // find find correct list_index to remove
        const listIndex = prevState.selected[type].indexOf(element.label)
        // remove list_index from prevState
        prevState.selected[type].splice(listIndex, 1)
      } else {
        // pass
      }

      // update the state.selected to reflect the new selected items
      this.setState(previousState => ({
        ...previousState,
        selected: prevState.selected
      }
      ))
    }
    // console.log(this.state.selected.dataset)
  }

  makeRequest (event, type) {
    var url = new URL(API_URL)
    var params = {}
    url.pathname += type

    // create the correct request based on the type parameter
    switch (type) {
      case 'groups':
        break
      case 'dataset':
        params = {
          dataset: this.state.selected.groups
        }
        break
      case 'meta':
        params = {
          groups: this.state.selected.groups,
          dataset: this.state.selected.dataset
        }
        break
      default:
        console.log('default')
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

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
        }))
      })
  }

  componentDidMount () {
    this.makeRequest(undefined, 'groups')
  }

  render () {
    let metaListboxes
    if (this.state.items.meta !== undefined) {
      metaListboxes = this.state.items.meta

      const keys = Object.keys(metaListboxes)

      metaListboxes = keys.map(key =>
        <JqxListBox
          key = {key}
          source={this.state.items.meta[key]}
          multipleextended={true}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />

      )
    }

    return (
      <div>
        <span>
          <JqxListBox
            source={this.state.items.groups}
            multipleextended={false}
            onChange={e => this.makeRequest(e, 'dataset')}
            onSelect={this.onSelect}
            onUnselect={this.onUnselect}
          />
          <JqxListBox
            source={this.state.items.dataset}
            multipleextended={false}
            onChange={e => this.makeRequest(e, 'meta')}
            onSelect={this.onSelect}
            onUnselect={this.onUnselect}
          />

          {/* // create listboxes dynamically depending on the elements in this.state.items.meta */}
          {metaListboxes}

        </span>

      </div>
    )
  }
}

export default Toprow
