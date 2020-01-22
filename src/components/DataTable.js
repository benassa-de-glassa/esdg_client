import React, { Component } from 'react'

import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

import { arraysToObject } from '../util/toObject'

export default class DataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.dataConverter = this.dataConverter.bind(this)
  }

  dataConverter () {
    if (this.props.columns !== undefined) {
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

      for (const [key, value] of Object.entries(this.props.data)) {
        console.log(key)
        Object.values(value).forEach(
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

    // return source
  }

  componentDidUpdate (prevState) {
    // Typical usage (don't forget to compare props):
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
      <div >
        {grid}
      </div>
    )
  }
}
