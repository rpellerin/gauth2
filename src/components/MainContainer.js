// Refacto: OK 2018-06-18
import React from 'react'
import PropTypes from 'prop-types'

class MainContainer extends React.PureComponent {
  static propTypes = {
    onPaste: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.onPaste = e => this.props.onPaste(e)
  }

  render() {
    return (
      <div
        style={{
          fontFamily: 'sans-serif',
          color: 'black',
          backgroundColor: 'white'
        }}
        onPaste={this.onPaste}
        onCopy={this.onPaste}
      >
        {this.props.children}
      </div>
    )
  }
}
export default MainContainer
