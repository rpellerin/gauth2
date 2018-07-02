import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { notify } from 'utils/notifications'
import { deleteAccount, updateAccount } from 'reducers/accounts'
import { EditIcon, SaveIcon, DeleteIcon } from 'components/Icons'
import './AccountRow.css'

const ESCAPE = 27
const ENTER = 13

class AccountRow extends React.PureComponent {
  static propTypes = {
    accountName: PropTypes.string,
    otp: PropTypes.string,
    timeLeft: PropTypes.number,
    updateAccount: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired
  }

  static defaultProps = {
    accountName: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      accountNameBeingEdited: this.props.accountName
    }
  }

  handleRefOtp = node => {
    if (node) this.otp = node
  }

  handleRefInputAccountName = node => {
    if (node) node.focus()
  }

  copyOtpToClipboard = () => {
    if (this.otp) {
      this.otp.select()
      document.execCommand('copy') && notify('Copied!')
    } else {
      notify('ERROR: Could not copy to clipboard')
    }
  }

  onSaveAccount = () => {
    this.props.updateAccount({
      oldAccountName: this.props.accountName,
      newAccountName: this.state.accountNameBeingEdited
    })
    this.toggleEditMode()
  }

  onDeleteAccount = () =>
    window.confirm('Are you sure?') &&
    this.props.deleteAccount(this.props.accountName)

  onChangeAccountName = e =>
    this.setState({ accountNameBeingEdited: e.target.value })

  onKeyDown = e =>
    e.keyCode === ESCAPE
      ? this.setState({
          editMode: false,
          accountNameBeingEdited: this.props.accountName
        })
      : e.keyCode === ENTER && this.onSaveAccount()

  toggleEditMode = () => this.setState({ editMode: !this.state.editMode })

  render() {
    const { accountName, otp, timeLeft } = this.props
    return (
      <li className="accountRow">
        <div className="otp" onClick={this.copyOtpToClipboard}>
          {otp}
          <input
            className="hiddenInput"
            type="text"
            value={otp || ''} /* removes react warning */
            ref={this.handleRefOtp}
            readOnly={true}
          />
        </div>
        {this.state.editMode ? (
          <input
            className="accountName"
            type="text"
            ref={this.handleRefInputAccountName}
            value={this.state.accountNameBeingEdited}
            onChange={this.onChangeAccountName}
            onKeyDown={this.onKeyDown}
          />
        ) : (
          <div onClick={this.copyOtpToClipboard} className="accountName">
            {accountName}
          </div>
        )}
        {typeof timeLeft !== 'undefined' ? (
          <span className="timeLeft">
            <span>{timeLeft}</span>
          </span>
        ) : null}
        {this.state.editMode && <SaveIcon onClick={this.onSaveAccount} />}
        {!this.state.editMode && <EditIcon onClick={this.toggleEditMode} />}
        <DeleteIcon onClick={this.onDeleteAccount} />
      </li>
    )
  }
}

export default connect(
  null,
  { deleteAccount, updateAccount }
)(AccountRow)
