import React, { Component } from 'react'
import Plot from 'react-plotly.js'

export class MapPlot extends Component {
  render () {
    var data = [{
      type: 'choropleth',
      locations: ['AFG', 'FRA', 'USA', 'CAN'],
      z: [1, 2, 3, 4]
    }]

    var layout = {
      title: '2014 Global GDP',
      geo: {
        showframe: false,
        showcoastlines: false,
        projection: {
          type: 'robinson'
        }
      }
    }
    return (
      <div>
        <Plot
          data={data}
          layout={layout}
        />
      </div>
    )
  }
}

export default MapPlot
