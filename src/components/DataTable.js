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

      for (var row of Object.values(this.props.data)) {
        // replace the dimension codes with the dimension labels as shown given in the props.meta object
        const rowCopy = [...row]
        for (const key of Object.keys(this.props.conversion)) {
          // create a dictionary like object from the conversion
          var conversionObject = {}
          this.props.conversion[key].forEach(obj =>
            conversionObject[obj.key] = obj.value
          )
          // get the correct column from the columns prop
          const column_index = this.props.columns.indexOf(key)
          // assign the correct value based on the received code
          rowCopy[column_index] = conversionObject[parseInt(row[column_index])]
        }

        // put localdata in the right format for the jqxgrid
        localdata.push(
          arraysToObject(this.props.columns, rowCopy)
        )
      }

      var source = new jqx.dataAdapter(
        {
          datatype: 'json',
          localdata: localdata,
          datafields: datafields
        }
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

  componentDidMount () {
    this.dataConverter()
  }

  componentDidUpdate (prevState) {
    // Typical usage (don't forget to compare props):
    if (this.props.data !== prevState.data) {
      this.dataConverter()
    }
  }

  render () {
    return (
      <Fragment >
        <JqxGrid source={this.state.source} columns={this.state.columns} />
      </Fragment>
    )
  }
}
