import React, { Component } from 'react'

import Toprow from './Toprow.js'
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import Plot from 'react-plotly.js'

import { API_URL } from '../paths.js'

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

    this.changeCentralElement = this.changeCentralElement.bind(this)
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
    var source = new jqx.dataAdapter(
      {
        datatype: 'json',
        localdata: this.state.data,
        datafields: this.state.datafields
      }
    )

    let centralElement
    if (this.state.view === 'grid') {
      centralElement = <JqxGrid source={source} columns={this.state.columns}/>
    } else if (this.state.view === 'plot') {
      centralElement =
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'red' }
          },
          { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] }
        ]}
        layout={ { width: 320, height: 240, title: 'A Fancy Plot' } }
      />
    }
    return (
      <div>
        <h1> ESDG</h1>
        <Toprow getSelected={this.getSelected} />
        { centralElement }
        {/* <JqxGrid source={source} columns={this.state.columns}/> */}
        <JqxButton onClick={this.changeCentralElement} width = {300}> Change central Element</JqxButton>
      </div>

    )
  }
}
export default MainPage
