import React from 'react'
import { connect } from 'react-redux'
import AccountRow from 'components/AccountRow'
import { getAccounts } from 'reducers/accounts'

const Accounts = ({ accounts, timeLeft }) => (
  <ul style={{ listStyleType: 'none', padding: 0 }}>
    {accounts.map(({ accountName, otp }, i) => (
      <AccountRow
        key={`${accountName}-${i}`}
        otp={otp}
        accountName={accountName}
        timeLeft={timeLeft}
      />
    ))}
  </ul>
)

export default connect(state => ({ accounts: getAccounts(state) }))(Accounts)
