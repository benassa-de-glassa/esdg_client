import React, { Component } from 'react'
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

import { API_URL } from '../paths.js'

class Toprow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: {},
      selected: {}
    }

    this.onSelect = this.onSelect.bind(this)
    this.onUnselect = this.onUnselect.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.makeRequest = this.makeRequest.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  onSelect (event) {
    const eventItem = event.args.item.originalItem
    const category = eventItem.type
    var prevStateSelected = this.state.selected

    /// add new item to the previous state based on the new selection
    if (this.state.selected[category] !== undefined) {
      prevStateSelected[category].push(eventItem.label)
    } else {
      prevStateSelected[category] = [eventItem.label]
    }
    // update the state.selected to reflect the new selected items
    this.setState(previousState => ({
      ...previousState,
      selected: prevStateSelected
    }))
  }

  onUnselect (event) {
    if (event.args.item !== null) {
      const eventItem = event.args.item.originalItem
      const category = eventItem.type
      var prevStateSelected = this.state.selected

      // find find correct list_index to remove
      const listIndex = prevStateSelected[category].indexOf(eventItem.label)
      // remove list_index from prevState
      prevStateSelected[category].splice(listIndex, 1)

      // update the state.selected to reflect the new selected items
      this.setState(previousState => ({
        ...previousState,
        selected: prevStateSelected
      }))
    }
  }

  onSubmit (event) {
    this.makeRequest(undefined, 'data')
  }

  makeRequest (e, type) {
    var url = new URL(API_URL)
    var params = {}
    url.pathname += type

    // create the correct request based on the type parameter
    switch (type) {
      case 'groups':
        break
      case 'dataset':
        // reset the state of selected datasets as the listbox has to be repopulated
        var prevStateSelected = this.state.selected
        prevStateSelected.dataset = []
        this.setState(previousState => ({
          ...previousState,
          selected: prevStateSelected
        }))
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
      case 'data':
        Object.entries(this.state.selected).forEach(([key, value]) => (params[key] = value))
        break
      default:
        console.log('this should not have happend')
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
    // finally update the prop value
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
          key={key}
          source={this.state.items.meta[key]}
          multipleextended={true}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />
      )
    }

    return (
      <span height={300}>
        <JqxListBox
          key={'groups'}
          source={this.state.items.groups}
          multipleextended={false}
          onChange={e => this.makeRequest(e, 'dataset')}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />
        <JqxListBox
          key={'dataset'}
          source={this.state.items.dataset}
          multipleextended={false}
          onChange={e => this.makeRequest(e, 'meta')}
          onSelect={this.onSelect}
          onUnselect={this.onUnselect}
        />
        {metaListboxes}

        <JqxButton
          width={120}
          height={30}
          onClick={this.onSubmit}> Submit
        </JqxButton>
      </span>
    )
  }
}

export default Toprow
