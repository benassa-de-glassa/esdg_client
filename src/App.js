import React, { Fragment } from 'react'

import './App.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'
// import 'jqwidgets-scripts/jqwidgets/styles/jqx.material-purple.css'

import Toprow from './components/Toprow.js'

function App () {
  var selected = {}
  return (
    <Fragment >
      <Toprow selected={selected} />
      {/* <Datatable selected={selected} /> */}
    </Fragment>
  )
}

export default App
