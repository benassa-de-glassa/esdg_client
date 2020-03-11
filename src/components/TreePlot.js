import React, { Component } from 'react'
import PropTypes from 'prop-types'

import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'

import Plot from 'react-plotly.js'

import { API_URL } from '../paths.js'

class TreePlot extends Component {
  constructor (props) {
    super(props)
    this.state = {
      harmonizedSystemConversion: {},
      selectableDimensions: [],
      productDimension: [],
      selectedDimension: {}
    }

    this.getHSConversionObject = this.getHSConversionObject.bind(this)
    this.getProductDimensions = this.getProductDimensions.bind(this)
    this.getValuesFromDimensionSelect = this.getValuesFromDimensionSelect.bind(this)

    this.onDimensionSelect = this.onDimensionSelect.bind(this)
    this.addDropdownRef = this.addDropdownRef.bind(this)
  }

  addDropdownRef (element) {
    if (element !== null) {
      const key = element._reactInternalFiber.key
      this.setState(previousState => ({
        ...previousState,
        references: {
          ...previousState.references,
          [key]: element
        }
      }))
    }
  }

  getHSConversionObject () {
    // grab the conversion from esdg codes to ISO3 codes
    var url = new URL(API_URL)
    url.pathname += 'hs'
    // create the request parameters
    var params = { maximum_code_level: 3 }
    // add parameters to url search parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // fetch the url
    // .then function chaining
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState(previousState => ({
          ...previousState,
          harmonizedSystemConversion: res
        }))
      })
  }

  // determine which dimensions are country dimensions and which aren't
  getProductDimensions () {
    // grab the conversion from esdg codes to ISO3 codes
    var url = new URL(API_URL)
    url.pathname += 'product_dimension'
    // create the request parameters
    var params = { groups: this.props.selected.groups, dataset: this.props.selected.dataset }
    // add parameters to url search parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // fetch the url
    // .then function chaining
    var dimensions = Object.keys(this.props.selected)
    let productDimension
    fetch(url)
      .then(res => res.json())
      .then(res => {
        productDimension = res
      })
      .then(
        res => {
          // remove group and dataset from list of selectables
          dimensions.splice(dimensions.indexOf('groups'), 1)
          dimensions.splice(dimensions.indexOf('dataset'), 1)
          // remove country dimensions from list of selectables
          // we assume all previously selected countries are to be plotted
          productDimension.forEach(value =>
            dimensions.splice(dimensions.indexOf(value), 1)
          )

          this.setState(previousState => ({
            ...previousState,
            productDimension: productDimension,
            selectableDimensions: dimensions
          }))
        }
      )
  }

  getValuesFromDimensionSelect () {
    const columnIndices = this.state.selectableDimensions.map(
      dimension => this.props.columns.indexOf(dimension))

    var reducedData = []
    // find the correct rows based on selectedDimensions
    for (var row of Object.values(this.props.data)) {
      // make a copy of the row... is this actually necessary?
      const rowCopy = [...row]
      var isGoodRow = true
      // iterate over all column indices
      for (const columnIndex of columnIndices) {
        if (columnIndex == -1) { continue } // skip for year columns which are not matched
        if (this.state.selectedDimension[this.props.columns[columnIndex]] === undefined) { continue } // skip for undefined dimension values e.g. when a dimension was not yet selected
        if (row[columnIndex] != this.state.selectedDimension[this.props.columns[columnIndex]]) {
          isGoodRow = false // set flag to false if any dimension does not match the row
        }
      }
      if (isGoodRow === true) reducedData.push(rowCopy)
    }
    // get the z data by choosing the data corresponding to the year
    // first get the year dimension
    const yearDimension = this.state.selectableDimensions[columnIndices.indexOf(-1)]
    // then find out in which column it is located
    const yearColumn = this.props.columns.indexOf(this.state.selectedDimension[yearDimension])
    // then map the column to a simple z array for the Plot component
    const values = reducedData.map(row => row[yearColumn])

    // get the location data from each row
    // get the correct column
    const productColumn = this.props.columns.indexOf(this.state.productDimension[0])
    // map the HS code to the correct label

    const ids = reducedData.map(row => String(row[productColumn]))
    console.log(ids)
    const labels = ids.map(id => String(this.state.harmonizedSystemConversion[id][0]))
    const parents = ids.map(id => this.state.harmonizedSystemConversion[id][1])

    this.setState(previousState => ({
      ...previousState,
      ids: ids,
      values: values,
      labels: labels,
      parents: parents
    }))
  }

  onDimensionSelect (event, key) {
    const ref = this.state.references[key].getSelectedItem()
    // if - ifelse needs to be refactored.. avoids infinte loops
    if (this.state.selectedDimension[key] === undefined) {
      this.setState(previousState => ({
        ...previousState,
        selectedDimension: {
          ...previousState.selectedDimension,
          [key]: ref.value
        }
      }))

      this.getValuesFromDimensionSelect()
    } else if (this.state.selectedDimension[key] !== ref.value) {
      this.setState(previousState => ({
        ...previousState,
        selectedDimension: {
          ...previousState.selectedDimension,
          [key]: ref.value
        }
      }))

      this.getValuesFromDimensionSelect()
    }
  }

  componentDidMount () {
    this.getHSConversionObject()
    if (this.props.conversion !== undefined) {
      this.getProductDimensions()
    }
  }

  componentDidUpdate (prevState) {
    if (this.props.data !== prevState.data) {
      this.getProductDimensions()
      this.state.selectableDimensions.forEach(dimension => {
        if (this.state.ref !== undefined) {
          this.onDimensionSelect(undefined, dimension)
        }
      })
    }
  }

  render () {
    const keys = this.state.selectableDimensions

    const dimensionalDropdownListboxes = keys.map(key => {
      return <div key={key} className="listbox-div">
        {key}<br />
        <JqxDropDownList
          ref={this.addDropdownRef}
          key={key}
          source={this.props.selected[key]}
          // selectedIndex={0}
          onSelect={e => this.onDimensionSelect(e, key)}
        />

      </div>
    })

    var data = [{
      type: 'treemap',
      ids: this.state.ids,
      labels: this.state.labels,
      values: this.state.values,
      parents: this.state.parents
    }]

    return (
      <div>
        <Plot
          data={data}
          // layout={layout}
        />
        <br />
        {dimensionalDropdownListboxes}
      </div>
    )
  }
}
TreePlot.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.object,
  conversion: PropTypes.object,
  selected: PropTypes.object
}
export default TreePlot
