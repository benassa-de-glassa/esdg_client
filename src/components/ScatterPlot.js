import React, { Component } from 'react'

import Plot from 'react-plotly.js'

class ScatterPlot extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.dataConverter = this.dataConverter.bind(this)
  }

  dataConverter () {
    // grab labels and convert them to strings and add them as names
    // remove labels from y data
    var ydata = []
    var xdata = []
    var labels = []

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

      const tempLabel = rowCopy.slice(0, Object.keys(this.props.conversion).length - 1)
      const tempY = rowCopy.slice(Object.keys(this.props.conversion).length - 1, rowCopy.length)

      labels.push(tempLabel)
      ydata.push(tempY)
      xdata = this.props.columns.slice(Object.keys(this.props.conversion).length - 1, rowCopy.length)
    }

    // remove dimensions from x data

    this.setState({
      xdata: xdata,
      ydata: ydata,
      labels: labels
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
    var dataList = []
    if (this.state.ydata !== undefined) {
      for (let index = 0; index < this.state.ydata.length; index++) {
        dataList.push({
          x: this.state.xdata,
          y: this.state.ydata[index],
          name: this.state.labels[index].join(', ')
        })
      }
    }

    return (
      <Plot
        data={
          dataList
        }
      />
    )
  }
}

export default ScatterPlot
