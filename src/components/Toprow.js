import React, { Component, Fragment } from 'react'
import JqxListBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxlistbox'
import JqxCheckBox from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcheckbox'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

import { API_URL } from '../paths.js'

class Toprow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: {}
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.addSelectRef = this.addSelectRef.bind(this)
    this.toggleSelection = this.toggleSelection.bind(this)

    this.makeRequest = this.makeRequest.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  onSubmit (event) {
    var selection = {
      groups: this.state.references.groups.getSelectedItem().label,
      dataset: this.state.references.dataset.getSelectedItem().label
    }

    Object.keys(this.state.items.meta).forEach(
      (key) => {
        var tempList = []
        Object.values(this.state.references[key].getSelectedItems()).forEach(
          (values) => {
            tempList.push(values.label)
          }
        )
        selection[key] = tempList
      }
    )
    this.props.getSelected(selection)
  }

  makeRequest (e, type) {
    var url = new URL(API_URL)
    url.pathname += type

    var params = {}
    // create the correct request based on the type parameter
    switch (type) {
      case 'groups':
        break
      case 'dataset':
        params = {
          groups: this.state.references.groups.getSelectedItem().label
        }
        break
      case 'meta':
        params = {
          groups: this.state.references.groups.getSelectedItem().label,
          dataset: this.state.references.dataset.getSelectedItem().label
        }
        break
      default:
        console.log('this should not have happend')
    }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    // fetch the url
    // .then function chaining
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState(prevState => ({
          ...prevState,
          items: {
            ...prevState.items,
            [type]: res[type]
          }
        }))
      })
  }

  addSelectRef (element) {
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

  toggleSelection (e, key) {
    const ref = this.state.references[key]
    console.log(ref, key)
    console.log(ref.getItems())
    for (const value in ref.getItems()) {
      ref.selectIndex(value)
    }
  }

  componentDidMount () {
    this.makeRequest(undefined, 'groups')
  }

  render () {
    let metaListboxes
    if (this.state.items.meta !== undefined) {
      metaListboxes = this.state.items.meta

      const keys = Object.keys(metaListboxes)

      metaListboxes = keys.map(key =>
        <div key={key} className="listbox-div">
          {key}<br/>
          <JqxListBox
            ref={this.addSelectRef}
            key={key}
            source={this.state.items.meta[key]}
            multipleextended={true}
          />
          <JqxCheckBox
            onChecked={e => this.toggleSelection(e, key)}
            onUnchecked={e => this.toggleSelection(e, key)}
          > Select all Items </JqxCheckBox>
        </div>
      )
    }

    return (
      <Fragment>
        <div className="toprow-div">
          <div className="listbox-div">
          groups <br/>
            <JqxListBox
              className="listbox-div"
              key={'groups'}
              ref={this.addSelectRef}
              source={this.state.items.groups}
              multipleextended={false}
              onChange={e => this.makeRequest(e, 'dataset')}
            />
          </div>
          <div className="listbox-div">
          dataset <br/>
            <JqxListBox
              className="listbox-div"
              key={'dataset'}
              ref={this.addSelectRef}
              source={this.state.items.dataset}
              multipleextended={false}
              onChange={e => this.makeRequest(e, 'meta')}
            />
          </div>

          {metaListboxes}
        </div>

        <div>
          <JqxButton
            width={120}
            height={30}
            onClick={this.onSubmit}>
              Submit
          </JqxButton>
        </div>
      </Fragment>
    )
  }
}

export default Toprow
