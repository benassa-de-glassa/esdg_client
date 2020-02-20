import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

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
      items: {},
      isSubmitable: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.addSelectRef = this.addSelectRef.bind(this)
    this.toggleSelection = this.toggleSelection.bind(this)

    this.makeRequest = this.makeRequest.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.submittable = this.submittable.bind(this)
  }

  onSubmit (event) {
    if (this.state.isSubmitable) {
      var selection = {
        groups: this.state.references.groups.getSelectedItem().label,
        dataset: this.state.references.dataset.getSelectedItem().label
      }

      Object.keys(this.state.items.meta).forEach(
        (key) => {
          var tempObject = {}
          Object.values(this.state.references[key].getSelectedItems()).forEach(
            (values) => {
              tempObject[values.value] = values.label
            }
          )
          selection[key] = tempObject
        }
      )
      this.props.getSelected(selection, this.state.items.meta)
    }
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
        if (type === 'meta') {
          for (const key of Object.keys(this.state.items.meta)) {
            this.setState(previousState => ({
              ...previousState,
              items: {
                ...previousState.items,
                meta: {
                  ...previousState.items.meta,
                  [key]: this.state.items.meta[key]
                }
              }
            }))
          }
        }
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
    const items = ref.getItems()
    const selectedItems = ref.getSelectedItems()

    if (e.type === 'checked') {
      // first unselect all items (by using ref.selectIndex, weird behaviour of this function)
      // then select all
      for (const value in selectedItems) {
        const index = selectedItems[value].visibleIndex
        ref.selectIndex(index)
      }
      for (const value in items) {
        ref.selectIndex(value)
      }
    } else {
      // unselect all items.. works as intended..
      for (const value in items) {
        ref.unselectIndex(value)
      }
    }
  }

  submittable (event) {
    // checks whether all listboxes have selected at least one item
    var isSubmitable = false
    var usedListboxes = 0
    if (this.state.references !== undefined) {
      for (const key of Object.keys(this.state.items.meta)) {
        const ref = this.state.references[key]
        usedListboxes += (ref.getSelectedItems().length > 0)
      }
      if (usedListboxes === Object.keys(this.state.items.meta).length) {
        isSubmitable = true
      }
      this.setState(previousState => ({
        ...previousState,
        isSubmitable: isSubmitable
      }))
    }
  }

  componentDidMount () {
    this.makeRequest(undefined, 'groups')
  }

  render () {
    let metaListboxes
    if (this.state.items.meta !== undefined) {
      const keys = Object.keys(this.state.items.meta)

      metaListboxes = keys.map(key => {
        return <div key={key} className="listbox-div">
          {key}<br />
          <JqxListBox
            ref={this.addSelectRef}
            key={key}
            source={this.state.items.meta[key]}
            multipleextended={true}
            onChange={e => this.submittable(e)}
          />
          <JqxCheckBox
            onChecked={e => this.toggleSelection(e, key)}
            onUnchecked={e => this.toggleSelection(e, key)}
          > Select all Items </JqxCheckBox>
        </div>
      }
      )
    }

    return (
      <Fragment>
        <div className="toprow-div">
          <div className="listbox-div">
            Domain <br />
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
            Dataset <br />
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
          <JqxButton disabled={!this.state.isSubmitable}
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

Toprow.propTypes = {
  getSelected: PropTypes.func
}

export default Toprow
