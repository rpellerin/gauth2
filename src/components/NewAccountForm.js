// Refacto: OK 2018-06-18
import React from 'react'
import PropTypes from 'prop-types'
import { actionButtonStyle } from 'components/Actions'

const inputStyle = {
  padding: '1em',
  border: '1px solid black',
  margin: '5px 0',
  width: '100%',
  boxSizing: 'border-box'
}

const inputDivStyle = {
  margin: '10px 0',
  textAlign: 'left'
}

class NewAccountForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { accountName: '', secret: '' }
    this.submit = e => {
      e.preventDefault()
      this.props.onSubmit(this.state)
    }
  }

  setAccountName = e => this.setState({ accountName: e.target.value })
  setSecret = e => this.setState({ secret: e.target.value })

  render() {
    const { onSubmit, ...rest } = this.props
    return (
      <form onSubmit={this.submit} {...rest}>
        <div style={inputDivStyle}>
          <label htmlFor="accountName">Account name</label>
          <br />
          <input
            type="text"
            id="accountName"
            value={this.state.accountName}
            style={inputStyle}
            onChange={this.setAccountName}
            placeholder="example: Twitter @johndoe"
          />
        </div>
        <div style={inputDivStyle}>
          <label htmlFor="secret">Secret</label>
          <br />
          <input
            type="text"
            id="secret"
            value={this.state.secret}
            style={inputStyle}
            onChange={this.setSecret}
          />
        </div>
        <button type="bubmit" style={actionButtonStyle}>
          Add new account
        </button>
      </form>
    )
  }
}

export default NewAccountForm
