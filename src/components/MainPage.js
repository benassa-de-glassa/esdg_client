import React, { Component } from 'react'

import Toprow from './Toprow.js'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'
import Plot from 'react-plotly.js'

import { API_URL } from '../paths.js'
import DataTable from './DataTable.js'

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
          header: res.header,
          data: res.data
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
    let centralElement
    if (this.state.view === 'grid') {
      centralElement = <DataTable columns={this.state.header} data={this.state.data}/>
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
        <JqxButton onClick={this.changeCentralElement} width = {300}> Change central Element</JqxButton>
      </div>

    )
  }
}
export default MainPage
