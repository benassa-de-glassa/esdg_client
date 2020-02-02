import React, { Component } from 'react'

import Toprow from './Toprow.js'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

import { API_URL } from '../paths.js'
import DataTable from './DataTable.js'
import ScatterPlot from './ScatterPlot.js'
import ButtonRow from './ButtonRow.js'

class MainPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: {},
      data: {},
      view: 'grid'
    }
    this.getSelected = this.getSelected.bind(this)
    this.getData = this.getData.bind(this)
    this.getView = this.getView.bind(this)

    this.changeCentralElement = this.changeCentralElement.bind(this)
  }

  getSelected (selected, meta, conversion) {
    this.setState({
      selected: selected,
      meta: meta,
      conversion: conversion
    })
    this.getData(selected)
  }

  getData (selected) {
    // grab the api url
    var url = new URL(API_URL)
    url.pathname += 'data'

    // create the request parameters
    var params = {}
    Object.keys(this.state.selected).forEach(key => (params[key] = this.state.selected[key]))
    // add parameters to url search parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // fetch the url
    // .then function chaining
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState(previousState => ({
          ...previousState,
          header: res.header,
          data: res.data
        }))
      })
  }

  getView (newView) {
    this.setState(previousState => ({
      ...previousState,
      view: newView
    }))
  }

  changeCentralElement () {
    if (this.state.view === 'grid') {
      this.setState(previousState => ({
        ...previousState,
        view: 'plot'
      }))
    } else {
      this.setState(previousState => ({
        ...previousState,
        view: 'grid'
      })
      )
    }
  }

  render () {
    let centralElement
    if (this.state.view === 'grid') {
      centralElement = <DataTable columns={this.state.header} data={this.state.data} conversion={this.state.meta} />
    } else if (this.state.view === 'plot') {
      centralElement = <ScatterPlot columns={this.state.header} data={this.state.data} conversion={this.state.meta} />
    }
    return (
      <div>
        <div >
          <h1> ESDG</h1>
        </div>
        <div>
          <Toprow getSelected={this.getSelected} />
        </div>
        <div>
          {centralElement}
        </div>
        <div>
          <ButtonRow onChange={this.getView} />
        </div>
      </div>
    )
  }
}
export default MainPage
