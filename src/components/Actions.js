import React from 'react'
import { connect } from 'react-redux'
import {
  getAccountsWithoutOtp,
  addAccount,
  addAccounts
} from 'reducers/accounts'
import NewAccountForm from 'components/NewAccountForm'
import JSONDownloader from 'components/JSONDownloader'
import ImportAccounts from 'components/ImportAccounts'
import EncryptStorage from 'components/EncryptStorage'

export const actionButtonStyle = {
  padding: '18px',
  display: 'inline-block',
  borderRadius: '6px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  textDecoration: 'none',
  color: 'white',
  backgroundColor: '#ff6300',
  margin: '10px 0',
  cursor: 'pointer',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  border: 0
}

const Actions = ({ addAccount, addAccounts, accounts }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'inline-block' }}>
      <NewAccountForm onSubmit={addAccount} />
      <h3>Other actions</h3>
      <div>
        <JSONDownloader
          data={accounts}
          filename="gauth2.json"
          style={actionButtonStyle}
        >
          Download saved accounts
        </JSONDownloader>
      </div>
      <ImportAccounts
        style={actionButtonStyle}
        onReceiveFile={accounts => {
          if (
            window.confirm(
              'Import these accounts? Existing accounts might be overwritten.'
            )
          ) {
            try {
              addAccounts(Object.values(JSON.parse(accounts)))
            } catch (ignore) {
              window.alert('Invalid file')
            }
          }
        }}
      />
      <div>
        <EncryptStorage style={actionButtonStyle} />
      </div>
    </div>
  </div>
)

export default connect(
  state => ({ accounts: getAccountsWithoutOtp(state) }),
  {
    addAccount,
    addAccounts
  }
)(Actions)
