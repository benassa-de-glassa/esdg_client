import React, { Component } from 'react'
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons'

export class ButtonRow extends Component {
  render () {
    return (
      <table>
        <tr>
          <td >
            <JqxButton
              width={120}
              height={30}
              onClick={e => this.props.onChange('grid')}
            >
            Grid
            </JqxButton>
          </td>
        </tr>

        <tr >
          <td>
            <JqxButton
              width={120}
              height={30}
              onClick={e => this.props.onChange('plot')}
            >
            Plot
            </JqxButton>
          </td>
          <td>
            <JqxButton
              width={120}
              height={30}
              onClick={e => this.props.onChange('map')}
            >
            Map
            </JqxButton>
          </td>
          <td>
            <JqxButton
              width={120}
              height={30}
              onClick={e => this.props.onChange('treemap')}
            >
            Treemap
            </JqxButton>
          </td>
        </tr>
      </table>
    )
  }
}

export default ButtonRow
