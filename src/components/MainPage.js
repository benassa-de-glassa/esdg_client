import React, { Component } from 'react'

import Toprow from './Toprow.js'
import JqxLoader from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxloader'

import { API_URL } from '../paths.js'
import DataTable from './DataTable.js'
import ScatterPlot from './ScatterPlot.js'
import ButtonRow from './ButtonRow.js'
import MapPlot from './MapPlot.js'

class MainPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: {},
      data: {},
      view: 'grid'
    }
    this.loadAnimator = React.createRef()
    this.getSelected = this.getSelected.bind(this)
    this.getData = this.getData.bind(this)
    this.getView = this.getView.bind(this)

    this.changeCentralElement = this.changeCentralElement.bind(this)
  }

  getSelected (selected, conversion) {
    // start the loading animator
    this.loadAnimator.current.open()

    // set an initial state
    this.setState({
      selected: selected,
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

    Object.keys(this.state.selected).forEach(dimension => {
      params[dimension] = Object.keys(this.state.selected[dimension])
    })
    params.groups = this.state.selected.groups
    params.dataset = this.state.selected.dataset
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
      .then(res =>
        this.loadAnimator.current.close()
      )
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
    switch (this.state.view) {
      case 'grid':
        centralElement = <DataTable columns={this.state.header} data={this.state.data} conversion={this.state.conversion} />
        break
      case 'plot':
        centralElement = <ScatterPlot columns={this.state.header} data={this.state.data} conversion={this.state.conversion} />
        break
      case 'map':
        centralElement = <MapPlot columns={this.state.header} data={this.state.data} conversion={this.state.conversion} selected={this.state.selected}/>
    }

    return (
      <div>
        <div >
          <h1> ESDG</h1>
          <JqxLoader
            ref={this.loadAnimator}
            isModal={true}
            width={90}
            height={90}
          />
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
