import React, { Component } from 'react'

import Toprow from './Toprow.js'
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

import { API_URL } from '../paths.js'

class MainPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: {},
      data: {}
    }
    this.getSelected = this.getSelected.bind(this)
    this.getData = this.getData.bind(this)
  }

  getSelected (selected) {
    this.setState({ selected: selected })
    this.getData(selected)
  }

  getData (selected) {
    // grab the api url
    var url = new URL(API_URL)
    url.pathname += 'data'

    // create the request parameters
    var params = {
      groups: this.state.selected.groups,
      dataset: this.state.selected.dataset
    }
    Object.keys(this.state.selected).forEach(key => (params[key] = this.state.selected[key]))

    // add parameters to url search parameters
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )
    // fetch the url
    // .then function chaining
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState(previousState => ({
          ...previousState,
          datafields: res.header,
          data: res.data,
          columns: res.columns
        }))
      })
  }

  render () {
    var source = new jqx.dataAdapter(
      {
        datatype: 'json',
        localdata: this.state.data,
        datafields: this.state.datafields
      }
    )
    return (
      <div>
        <h1> ESDG</h1>
        <Toprow getSelected={this.getSelected} />
        <JqxGrid source={source} columns={this.state.columns}/>
      </div>
    )
  }
}
export default MainPage
