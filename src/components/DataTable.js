import React, { Component, Fragment } from 'react'

import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

import { arraysToObject } from '../util/toObject'

export default class DataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.dataConverter = this.dataConverter.bind(this)
  }

  dataConverter () {
    var datafields = []
    var columns = []
    this.props.columns.forEach(
      header => {
        datafields.push({
          name: header,
          type: 'string'
        })
        columns.push({
          text: header,
          datafield: header,
          columntype: 'quantity',
          width: 80
        })
      }
    )

    var localdata = []

    for (const [key, dataItem] of Object.entries(this.props.data)) {
      // map the country, product etc codes to the correct string
      // find the correct indices to convert


    //   var dimensionIndices = []
    //   Object.keys(this.props.conversion).forEach(
    //     dimensionKey =>
    //       dimensionIndices.push(this.props.columns.findIndex(dimensionKey))
    //   )

      //   // access the correct columns
      //   for (let dimensionIndex = 0; dimensionIndex < dimensionIndices.length; dimensionIndex++) {
      //     const column = dimensionIndices[dimensionIndex]
      //     console.log(columns)
      //     // access each row
      //     for (let rowIndex = 0; rowIndex < value.length; rowIndex++) {
      //       const element = value[rowIndex]
      //     }
      //   }

      Object.values(dataItem).forEach(
        arr =>
          localdata.push(
            arraysToObject(this.props.columns, arr)
          )
      )
    }

    // eslint-disable-next-line
    var source = new jqx.dataAdapter(
      {
        datatype: 'json',
        localdata: localdata,
        datafields: datafields
      }
    )

    this.setState({
      columns: columns,
      source: source
    })
  }

  componentDidUpdate (prevState) {
    // convert the input data only when new data is passed as a prop
    if (this.props.data !== prevState.data) {
      this.dataConverter()
    }
  }

  render () {
    let grid
    if (this.state.source === undefined) {
      grid = <JqxGrid source = {this.state.source} columns={this.state.columns}/>
    } else {
      grid = <JqxGrid source = {this.state.source} columns={this.state.columns}/>
    }
    return (
      <Fragment >
        {grid}
      </Fragment>
    )
  }
}
