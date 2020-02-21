import React, { Component } from 'react'
import PropTypes from 'prop-types'

import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist'

import Plot from 'react-plotly.js'
import { API_URL } from '../paths'

class MapPlot extends Component {
  // constructor
  constructor (props) {
    super(props)
    this.state = {
      countryCodeConversion: {},
      selectableDimensions: [],
      countryDimensions: [],
      selectedDimension: {}
    }

    this.getCountryConversionObject = this.getCountryConversionObject.bind(this)
    this.getCountryDimensions = this.getCountryDimensions.bind(this)
    this.getValuesFromDimensionSelect = this.getValuesFromDimensionSelect.bind(this)

    this.onDimensionSelect = this.onDimensionSelect.bind(this)
    this.addDropdownRef = this.addDropdownRef.bind(this)
  }

  // add references for the dropdown listboxes
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

  // get the ISO3 codes required for plotly
  getCountryConversionObject () {
    // grab the conversion from esdg codes to ISO3 codes
    var url = new URL(API_URL)
    url.pathname += 'country_conversion'
    // create the request parameters
    var params = { from_code: 'FAOSTAT', to_code: 'ISO3' }
    // add parameters to url search parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // fetch the url
    // .then function chaining
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState(previousState => ({
          ...previousState,
          countryCodeConversion: res
        }))
      })
  }

  // determine which dimensions are country dimensions and which aren't
  getCountryDimensions () {
    // grab the conversion from esdg codes to ISO3 codes
    var url = new URL(API_URL)
    url.pathname += 'country_dimension'
    // create the request parameters
    var params = { groups: this.props.selected.groups, dataset: this.props.selected.dataset }
    // add parameters to url search parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    // fetch the url
    // .then function chaining
    var dimensions = Object.keys(this.props.selected)
    let countryDimension
    fetch(url)
      .then(res => res.json())
      .then(res => {
        countryDimension = res
      })
      .then(
        res => {
          // remove group and dataset from list of selectables
          dimensions.splice(dimensions.indexOf('groups'), 1)
          dimensions.splice(dimensions.indexOf('dataset'), 1)
          // remove country dimensions from list of selectables
          // we assume all previously selected countries are to be plotted
          countryDimension.forEach(value =>
            dimensions.splice(dimensions.indexOf(value), 1)
          )

          this.setState(previousState => ({
            ...previousState,
            countryDimensions: countryDimension,
            selectableDimensions: dimensions
          }))
        }
      )
  }

  // handles the change of a dropDownListbox
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
    }
    else if (this.state.selectedDimension[key] !== ref.value) {
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

  getValuesFromDimensionSelect() {
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
        if (columnIndex == -1 ) {continue} // skip for year columns which are not matched
        if (this.state.selectedDimension[this.props.columns[columnIndex]] === undefined) {continue} // skip for undefined dimension values e.g. when a dimension was not yet selected
        if (row[columnIndex] != this.state.selectedDimension[this.props.columns[columnIndex]]) {
          isGoodRow = false // set flag to false if any dimension does not match the row
        }
      }
      if (isGoodRow === true) reducedData.push(rowCopy)
    }
    // get the z data by choosing the data corresponding to the year
    //first get the year dimension
    const yearDimension = this.state.selectableDimensions[columnIndices.indexOf(-1)]
    // then find out in which column it is located
    const yearColumn = this.props.columns.indexOf(this.state.selectedDimension[yearDimension])
    // then map the column to a simple z array for the Plot component
    const z = reducedData.map(row => row[yearColumn])
    
    // get the location data from each row
    // get the correct column
    const countryColumn = this.props.columns.indexOf(this.state.countryDimensions[0])
    // map the FAOSTAT codes to the ISO3 codes required for the plotly.js component
    const locations = reducedData.map(row => this.state.countryCodeConversion[row[countryColumn]])
    
    this.setState(previousState => ({
      ...previousState,
      z: z,
      locations: locations
    }))
  }

  componentDidMount () {
    this.getCountryConversionObject()
    if (this.props.conversion !== undefined) {
      this.getCountryDimensions()
    }
  }

  componentDidUpdate (prevState) {
    if (this.props.data !== prevState.data) {
      console.log('props did update')
      this.getCountryDimensions()
      this.state.selectableDimensions.forEach(dimension => {
        this.onDimensionSelect(undefined, dimension)
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
      type: 'choropleth',
      locations: this.state.locations,
      z: this.state.z
    }]

    var layout = {
      title: '', // create title dynamically from selection
      geo: {// TODO: allow user to select these options
        showframe: false,
        showcoastlines: true,
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
        <br />
        {dimensionalDropdownListboxes}
      </div>
    )
  }
}

MapPlot.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.object,
  conversion: PropTypes.object,
  selected: PropTypes.object
}

export default MapPlot
