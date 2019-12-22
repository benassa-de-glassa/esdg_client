import React, { Component } from 'react'

import Toprow from './Toprow.js'

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
    this.setState(previousState => ({
      ...previousState,
      selected: selected
    }))

    this.getData(selected)
  }

  getData (selected) {
    // grab the api url
    var url = new URL(API_URL)
    url.pathname += 'data'

    // create the request
    var params = {}
    Object.entries(selected).forEach(([key, value]) => (params[key] = value))
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
          data: res
        }))
      })
  }

  render () {
    return (
      <div>
        <h1> ESDG</h1>
        <Toprow getSelected={this.getSelected} />

      </div>
    )
  }
}
export default MainPage
