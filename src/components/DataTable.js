import React, { Component, Fragment as div } from 'react'
import PropTypes from 'prop-types'

import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid'

import { arraysToObject } from '../util/toObject'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

export default class DataTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }

    this.myGrid = React.createRef()

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

      // freezes the first couple columns to make horizontal scrolling more user friendly
      for (let index = 0; index < Object.keys(this.props.conversion).length - 1; index++) {
        columns[index].pinned = true
      }

      // convert dimension codes to correct corresponding labels
      var localdata = []

      for (var row of Object.values(this.props.data)) {
        // replace the dimension codes with the dimension labels as shown given in the props.meta object
        const rowCopy = [...row]

        for (const key of Object.keys(this.props.conversion)) {
          // get a dictionary like object from the conversion
          const conversionObject = this.props.conversion[key]
          // get the correct column
          const columnIndex = this.props.columns.indexOf(key)
          // assign the correct value based on the received code
          rowCopy[columnIndex] = conversionObject[row[columnIndex]]
        }

        // put localdata in the right format for the jqxgrid
        localdata.push(
          arraysToObject(this.props.columns, rowCopy)
        )
      }
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
      <div style={{ float: 'left' }}>
        <JqxGrid
          ref={this.myGrid}
          source={this.state.source}
          columns={this.state.columns}
          columnsresize={true}
        />

        <div>
          <JqxButton onClick={e => this.myGrid.current.exportdata('csv', 'data')} width={40}> export to csv </JqxButton>
          <JqxButton onClick={e => this.myGrid.current.exportdata('xls', 'data')} width={40}> export to xls </JqxButton>
        </div>
      </div >
    )
  }
}

DataTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.object,
  conversion: PropTypes.array
}
