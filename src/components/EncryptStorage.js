import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEncrypted, setEncryptionStatus } from 'reducers/encryption'
import { notify } from 'utils/notifications'

const generateStyle = (style, isEncrypted) => ({
  ...style,
  ...(isEncrypted ? { backgroundColor: 'green' } : {})
})

class EncryptStorage extends React.Component {
  static propTypes = {
    setEncryptionStatus: PropTypes.func.isRequired,
    isEncrypted: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.enableEncryption = () => {
      const password = window.prompt('Please set a password')
      if (!password || !password.trim()) {
        return notify('Cannot encrypt with a blank password')
      }
      this.props.setEncryptionStatus({ enabled: true, password })
    }
    this.disableEncryption = () =>
      window.confirm('Are you sure?') &&
      this.props.setEncryptionStatus({ enabled: false })
  }

  render() {
    const { isEncrypted, style, setEncryptionStatus, ...props } = this.props
    return (
      <button
        {...props}
        onClick={isEncrypted ? this.disableEncryption : this.enableEncryption}
        style={generateStyle(style, isEncrypted)}
      >
        {isEncrypted
          ? '✔ Encryption enabled. Click to disable'
          : 'Enable encryption'}
      </button>
    )
  }
}

export default connect(
  state => ({
    isEncrypted: isEncrypted(state)
  }),
  { setEncryptionStatus }
)(EncryptStorage)
