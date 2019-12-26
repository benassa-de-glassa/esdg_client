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
      items: {}
    }

    // this.onSelect = this.onSelect.bind(this)
    // this.onUnselect = this.onUnselect.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.addSelectRef = this.addSelectRef.bind(this)

    this.makeRequest = this.makeRequest.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  onSubmit (event) {
    var selection = {
      groups: this.state.references.groups.getSelectedItem().label,
      dataset: this.state.references.dataset.getSelectedItem().label
    }

    Object.keys(this.state.items.meta).forEach(
      (key) => {
        var tempList = []
        Object.values(this.state.references[key].getSelectedItems()).forEach(
          (values) => {
            tempList.push(values.label)
          }
        )
        selection[key] = tempList
      }
    )
    this.props.getSelected(selection)
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
        params = {
          groups: this.state.references.groups.getSelectedItem().label
        }
        break
      case 'meta':
        params = {
          groups: this.state.references.groups.getSelectedItem().label,
          dataset: this.state.references.dataset.getSelectedItem().label
        }
        break
      case 'data':
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

  addSelectRef (element) {
    if (element !== null) {
      const key = element._reactInternalFiber.key
      this.setState(previousState => ({
        ...previousState,
        references: {
          ...previousState.references,
          [key]: element
        }
      }))
    }
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
          ref={this.addSelectRef}
          key={key}
          source={this.state.items.meta[key]}
          multipleextended={true}
        />
      )
    }

    return (
      <div>
        <JqxListBox
          key={'groups'}
          ref={this.addSelectRef}
          source={this.state.items.groups}
          multipleextended={false}
          onChange={e => this.makeRequest(e, 'dataset')}
        />
        <JqxListBox
          key={'dataset'}
          ref={this.addSelectRef}
          source={this.state.items.dataset}
          multipleextended={false}
          onChange={e => this.makeRequest(e, 'meta')}
        />
        {metaListboxes}

        <JqxButton
          width={120}
          height={30}
          onClick={this.onSubmit}> Submit
        </JqxButton>
      </div>
    )
  }
}

export default Toprow
